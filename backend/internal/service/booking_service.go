package service

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"sync"
	"time"

	"github.com/asana-yoga/backend/internal/models"
)

var (
	ErrSessionNotFound     = errors.New("session not found")
	ErrSessionNotOpen      = errors.New("session is not open for booking")
	ErrCapacityExceeded    = errors.New("session capacity exceeded: fully booked")
	ErrDuplicateBooking    = errors.New("customer has already booked this session")
	ErrBookingNotFound     = errors.New("booking not found")
	ErrAlreadyCancelled    = errors.New("booking is already cancelled")
	ErrPolicyDeadlinePast  = errors.New("cancellation window has passed")
	ErrUnauthorizedBooking = errors.New("unauthorized to modify this booking")
)

type BookingRepository interface {
	GetSessionForUpdate(ctx context.Context, sessionID string) (*models.Session, error)
	CreateBookingWithSession(ctx context.Context, booking *models.Booking, session *models.Session) error
	GetBookingByID(ctx context.Context, id string) (*models.Booking, error)
	GetCustomerBookings(ctx context.Context, customerID string) ([]*models.Booking, error)
	GetBookingByIdempotency(ctx context.Context, key string) (*models.Booking, error)
	UpdateBookingStatus(ctx context.Context, bookingID string, status models.BookingStatus, sessionID string) error
	CheckDuplicateBooking(ctx context.Context, customerID, sessionID string) (bool, error)
}

type BookingService struct {
	repo                   BookingRepository
	cancellationWindowHour int
	mu                     sync.Mutex
}

func NewBookingService(repo BookingRepository, cancellationWindowHour int) *BookingService {
	if cancellationWindowHour <= 0 {
		cancellationWindowHour = 4
	}
	return &BookingService{
		repo:                   repo,
		cancellationWindowHour: cancellationWindowHour,
	}
}

type CreateBookingInput struct {
	CustomerID     string
	CustomerName   string
	CustomerEmail  string
	SessionID      string
	IdempotencyKey string
}

func (s *BookingService) CreateBooking(ctx context.Context, input CreateBookingInput) (*models.Booking, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// 1. Idempotency Check
	if input.IdempotencyKey != "" {
		existing, err := s.repo.GetBookingByIdempotency(ctx, input.IdempotencyKey)
		if err == nil && existing != nil {
			return existing, nil
		}
	}

	// 2. Prevent Duplicate Booking
	isDup, err := s.repo.CheckDuplicateBooking(ctx, input.CustomerID, input.SessionID)
	if err != nil {
		return nil, err
	}
	if isDup {
		return nil, ErrDuplicateBooking
	}

	// 3. Concurrency-Safe Transaction Check for Session & Capacity
	session, err := s.repo.GetSessionForUpdate(ctx, input.SessionID)
	if err != nil {
		return nil, ErrSessionNotFound
	}

	if session.Status != "SCHEDULED" {
		return nil, ErrSessionNotOpen
	}

	if session.BookedCount >= session.Capacity {
		return nil, ErrCapacityExceeded
	}

	// 4. Increment Booked Count atomically
	session.BookedCount++

	// 5. Generate Reference Number
	refNumber := fmt.Sprintf("ASN-%06d", rand.Intn(900000)+100000)

	booking := &models.Booking{
		ID:               fmt.Sprintf("book-%d", time.Now().UnixNano()),
		CustomerID:       input.CustomerID,
		CustomerName:     input.CustomerName,
		CustomerEmail:    input.CustomerEmail,
		SessionID:        session.ID,
		ClassID:          session.ClassID,
		InstructorName:   session.InstructorID,
		SessionStartsAt:  session.StartsAt,
		SessionEndsAt:    session.EndsAt,
		BookingReference: refNumber,
		Status:           models.BookingStatusConfirmed,
		PaymentStatus:    "PAID",
		PriceSnapshot:    session.Price,
		Currency:         session.Currency,
		IdempotencyKey:   input.IdempotencyKey,
		CreatedAt:        time.Now().UTC(),
		UpdatedAt:        time.Now().UTC(),
	}

	if err := s.repo.CreateBookingWithSession(ctx, booking, session); err != nil {
		return nil, err
	}

	return booking, nil
}

func (s *BookingService) CancelBooking(ctx context.Context, bookingID, customerID string, isAdmin bool) (*models.Booking, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	booking, err := s.repo.GetBookingByID(ctx, bookingID)
	if err != nil {
		return nil, ErrBookingNotFound
	}

	if !isAdmin && booking.CustomerID != customerID {
		return nil, ErrUnauthorizedBooking
	}

	if booking.Status == models.BookingStatusCancelled {
		return nil, ErrAlreadyCancelled
	}

	// Policy deadline enforcement
	if !isAdmin {
		deadline := booking.SessionStartsAt.Add(-time.Duration(s.cancellationWindowHour) * time.Hour)
		if time.Now().UTC().After(deadline) {
			return nil, ErrPolicyDeadlinePast
		}
	}

	err = s.repo.UpdateBookingStatus(ctx, bookingID, models.BookingStatusCancelled, booking.SessionID)
	if err != nil {
		return nil, err
	}

	booking.Status = models.BookingStatusCancelled
	now := time.Now().UTC()
	booking.CancelledAt = &now

	return booking, nil
}
