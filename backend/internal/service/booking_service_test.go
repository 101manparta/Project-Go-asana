package service

import (
	"context"
	"fmt"
	"sync"
	"testing"
	"time"

	"github.com/asana-yoga/backend/internal/models"
)

type mockBookingRepo struct {
	mu            sync.Mutex
	session       *models.Session
	bookings      map[string]*models.Booking
	idempotentMap map[string]*models.Booking
}

func newMockBookingRepo(capacity int) *mockBookingRepo {
	return &mockBookingRepo{
		session: &models.Session{
			ID:          "sess-test-1",
			ClassID:     "class-1",
			Capacity:    capacity,
			BookedCount: 0,
			Status:      "SCHEDULED",
			StartsAt:    time.Now().Add(24 * time.Hour),
			EndsAt:      time.Now().Add(25 * time.Hour),
			Price:       2800,
			Currency:    "USD",
		},
		bookings:      make(map[string]*models.Booking),
		idempotentMap: make(map[string]*models.Booking),
	}
}

func (m *mockBookingRepo) GetSessionForUpdate(ctx context.Context, sessionID string) (*models.Session, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.session, nil
}

func (m *mockBookingRepo) CreateBookingWithSession(ctx context.Context, booking *models.Booking, session *models.Session) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.bookings[booking.ID] = booking
	if booking.IdempotencyKey != "" {
		m.idempotentMap[booking.IdempotencyKey] = booking
	}
	return nil
}

func (m *mockBookingRepo) GetBookingByID(ctx context.Context, id string) (*models.Booking, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	b, ok := m.bookings[id]
	if !ok {
		return nil, ErrBookingNotFound
	}
	return b, nil
}

func (m *mockBookingRepo) GetCustomerBookings(ctx context.Context, customerID string) ([]*models.Booking, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	var list []*models.Booking
	for _, b := range m.bookings {
		if b.CustomerID == customerID {
			list = append(list, b)
		}
	}
	return list, nil
}

func (m *mockBookingRepo) GetBookingByIdempotency(ctx context.Context, key string) (*models.Booking, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	return m.idempotentMap[key], nil
}

func (m *mockBookingRepo) UpdateBookingStatus(ctx context.Context, bookingID string, status models.BookingStatus, sessionID string) error {
	m.mu.Lock()
	defer m.mu.Unlock()
	if b, ok := m.bookings[bookingID]; ok {
		b.Status = status
		if status == models.BookingStatusCancelled && m.session.BookedCount > 0 {
			m.session.BookedCount--
		}
	}
	return nil
}

func (m *mockBookingRepo) CheckDuplicateBooking(ctx context.Context, customerID, sessionID string) (bool, error) {
	m.mu.Lock()
	defer m.mu.Unlock()
	for _, b := range m.bookings {
		if b.CustomerID == customerID && b.SessionID == sessionID && b.Status == models.BookingStatusConfirmed {
			return true, nil
		}
	}
	return false, nil
}

func TestBookingCapacityEnforcement(t *testing.T) {
	repo := newMockBookingRepo(2) // Only 2 spots!
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	// Booking 1 - success
	_, err := svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-1",
		CustomerName:  "User One",
		CustomerEmail: "u1@test.com",
		SessionID:     "sess-test-1",
	})
	if err != nil {
		t.Fatalf("expected booking 1 to succeed, got %v", err)
	}

	// Booking 2 - success
	_, err = svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-2",
		CustomerName:  "User Two",
		CustomerEmail: "u2@test.com",
		SessionID:     "sess-test-1",
	})
	if err != nil {
		t.Fatalf("expected booking 2 to succeed, got %v", err)
	}

	// Booking 3 - should FAIL with ErrCapacityExceeded
	_, err = svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-3",
		CustomerName:  "User Three",
		CustomerEmail: "u3@test.com",
		SessionID:     "sess-test-1",
	})
	if err != ErrCapacityExceeded {
		t.Fatalf("expected ErrCapacityExceeded, got %v", err)
	}
}

func TestDuplicateBookingPrevention(t *testing.T) {
	repo := newMockBookingRepo(10)
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	_, err := svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-1",
		CustomerName:  "User One",
		CustomerEmail: "u1@test.com",
		SessionID:     "sess-test-1",
	})
	if err != nil {
		t.Fatalf("initial booking failed: %v", err)
	}

	// Attempt duplicate
	_, err = svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-1",
		CustomerName:  "User One",
		CustomerEmail: "u1@test.com",
		SessionID:     "sess-test-1",
	})
	if err != ErrDuplicateBooking {
		t.Fatalf("expected ErrDuplicateBooking, got %v", err)
	}
}

func TestBookingIdempotency(t *testing.T) {
	repo := newMockBookingRepo(10)
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	input := CreateBookingInput{
		CustomerID:     "user-1",
		CustomerName:   "User One",
		CustomerEmail:  "u1@test.com",
		SessionID:      "sess-test-1",
		IdempotencyKey: "idemp-key-12345",
	}

	b1, err := svc.CreateBooking(ctx, input)
	if err != nil {
		t.Fatalf("first booking failed: %v", err)
	}

	// Replay with identical idempotency key
	b2, err := svc.CreateBooking(ctx, input)
	if err != nil {
		t.Fatalf("idempotent replay failed: %v", err)
	}

	if b1.ID != b2.ID {
		t.Fatalf("expected same booking ID on replay, got %s and %s", b1.ID, b2.ID)
	}
	if repo.session.BookedCount != 1 {
		t.Fatalf("expected bookedCount to remain 1, got %d", repo.session.BookedCount)
	}
}

func TestBookingCancellation_Success(t *testing.T) {
	repo := newMockBookingRepo(5)
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	b, err := svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-cust-1",
		CustomerName:  "Arya Stark",
		CustomerEmail: "arya@test.com",
		SessionID:     "sess-test-1",
	})
	if err != nil {
		t.Fatalf("create booking failed: %v", err)
	}

	if repo.session.BookedCount != 1 {
		t.Fatalf("expected bookedCount 1, got %d", repo.session.BookedCount)
	}

	cancelled, err := svc.CancelBooking(ctx, b.ID, "user-cust-1", false)
	if err != nil {
		t.Fatalf("expected cancellation to succeed, got %v", err)
	}

	if cancelled.Status != models.BookingStatusCancelled {
		t.Fatalf("expected status CANCELLED, got %s", cancelled.Status)
	}
	if repo.session.BookedCount != 0 {
		t.Fatalf("expected capacity to be released (bookedCount=0), got %d", repo.session.BookedCount)
	}
}

func TestBookingCancellation_Unauthorized(t *testing.T) {
	repo := newMockBookingRepo(5)
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	b, err := svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-cust-1",
		CustomerName:  "Arya Stark",
		CustomerEmail: "arya@test.com",
		SessionID:     "sess-test-1",
	})
	if err != nil {
		t.Fatalf("create booking failed: %v", err)
	}

	// Another customer attempts to cancel Arya's booking
	_, err = svc.CancelBooking(ctx, b.ID, "attacker-user-99", false)
	if err != ErrUnauthorizedBooking {
		t.Fatalf("expected ErrUnauthorizedBooking, got %v", err)
	}
}

func TestBookingCancellation_AlreadyCancelled(t *testing.T) {
	repo := newMockBookingRepo(5)
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	b, err := svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-cust-1",
		CustomerName:  "Arya Stark",
		CustomerEmail: "arya@test.com",
		SessionID:     "sess-test-1",
	})
	if err != nil {
		t.Fatalf("create booking failed: %v", err)
	}

	_, err = svc.CancelBooking(ctx, b.ID, "user-cust-1", false)
	if err != nil {
		t.Fatalf("first cancel failed: %v", err)
	}

	// Second cancel
	_, err = svc.CancelBooking(ctx, b.ID, "user-cust-1", false)
	if err != ErrAlreadyCancelled {
		t.Fatalf("expected ErrAlreadyCancelled, got %v", err)
	}
}

func TestBookingCancellation_PolicyDeadlinePast(t *testing.T) {
	repo := newMockBookingRepo(5)
	// Set session to start in 2 hours (less than 4h window)
	repo.session.StartsAt = time.Now().Add(2 * time.Hour)
	repo.session.EndsAt = time.Now().Add(3 * time.Hour)
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	b, err := svc.CreateBooking(ctx, CreateBookingInput{
		CustomerID:    "user-cust-1",
		CustomerName:  "Arya Stark",
		CustomerEmail: "arya@test.com",
		SessionID:     "sess-test-1",
	})
	if err != nil {
		t.Fatalf("create booking failed: %v", err)
	}

	// Customer cancel within 4-hour window should be rejected
	_, err = svc.CancelBooking(ctx, b.ID, "user-cust-1", false)
	if err != ErrPolicyDeadlinePast {
		t.Fatalf("expected ErrPolicyDeadlinePast, got %v", err)
	}

	// Admin cancellation override should succeed
	cancelledAdmin, err := svc.CancelBooking(ctx, b.ID, "user-cust-1", true)
	if err != nil {
		t.Fatalf("admin cancel override failed: %v", err)
	}
	if cancelledAdmin.Status != models.BookingStatusCancelled {
		t.Fatalf("expected CANCELLED, got %s", cancelledAdmin.Status)
	}
}

func TestConcurrentBookingRaceSafety(t *testing.T) {
	const capacity = 5
	const totalAttempts = 15

	repo := newMockBookingRepo(capacity)
	svc := NewBookingService(repo, 4)
	ctx := context.Background()

	var wg sync.WaitGroup
	var successfulCount int
	var capacityExceededCount int
	var lock sync.Mutex

	for i := 0; i < totalAttempts; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			_, err := svc.CreateBooking(ctx, CreateBookingInput{
				CustomerID:    fmt.Sprintf("user-%d", idx),
				CustomerName:  fmt.Sprintf("User %d", idx),
				CustomerEmail: fmt.Sprintf("u%d@test.com", idx),
				SessionID:     "sess-test-1",
			})
			lock.Lock()
			defer lock.Unlock()
			if err == nil {
				successfulCount++
			} else if err == ErrCapacityExceeded {
				capacityExceededCount++
			}
		}(i)
	}

	wg.Wait()

	if successfulCount != capacity {
		t.Fatalf("expected exactly %d successful bookings, got %d", capacity, successfulCount)
	}
	if capacityExceededCount != (totalAttempts - capacity) {
		t.Fatalf("expected %d capacity exceeded errors, got %d", totalAttempts-capacity, capacityExceededCount)
	}
	if repo.session.BookedCount != capacity {
		t.Fatalf("expected bookedCount %d, got %d", capacity, repo.session.BookedCount)
	}
}
