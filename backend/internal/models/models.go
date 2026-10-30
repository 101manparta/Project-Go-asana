package models

import "time"

type Role string

const (
	RoleCustomer   Role = "CUSTOMER"
	RoleInstructor Role = "INSTRUCTOR"
	RoleAdmin      Role = "ADMIN"
	RoleSuperAdmin Role = "SUPER_ADMIN"
)

type BookingStatus string

const (
	BookingStatusConfirmed  BookingStatus = "CONFIRMED"
	BookingStatusCancelled  BookingStatus = "CANCELLED"
	BookingStatusCompleted  BookingStatus = "COMPLETED"
	BookingStatusNoShow     BookingStatus = "NO_SHOW"
	BookingStatusWaitlisted BookingStatus = "WAITLISTED"
)

type User struct {
	UID              string    `firestore:"uid" json:"uid"`
	Email            string    `firestore:"email" json:"email"`
	DisplayName      string    `firestore:"displayName" json:"displayName"`
	Role             Role      `firestore:"role" json:"role"`
	Phone            string    `firestore:"phone,omitempty" json:"phone,omitempty"`
	AvatarURL        string    `firestore:"avatarUrl,omitempty" json:"avatarUrl,omitempty"`
	RemainingCredits int       `firestore:"remainingCredits" json:"remainingCredits"`
	MembershipID     string    `firestore:"membershipId,omitempty" json:"membershipId,omitempty"`
	AccountStatus    string    `firestore:"accountStatus" json:"accountStatus"`
	CreatedAt        time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt        time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type Class struct {
	ID                     string    `firestore:"id" json:"id"`
	Title                  string    `firestore:"title" json:"title"`
	Slug                   string    `firestore:"slug" json:"slug"`
	Description            string    `firestore:"description" json:"description"`
	LongDescription        string    `firestore:"longDescription" json:"longDescription"`
	Style                  string    `firestore:"style" json:"style"`
	Level                  string    `firestore:"level" json:"level"`
	DurationMinutes        int       `firestore:"durationMinutes" json:"durationMinutes"`
	Price                  int64     `firestore:"price" json:"price"` // in cents
	Currency               string    `firestore:"currency" json:"currency"`
	InstructorIDs          []string  `firestore:"instructorIds" json:"instructorIds"`
	ImageURL               string    `firestore:"imageUrl" json:"imageUrl"`
	IsPublished            bool      `firestore:"isPublished" json:"isPublished"`
	Benefits               []string  `firestore:"benefits" json:"benefits"`
	WhatToBring            []string  `firestore:"whatToBring" json:"whatToBring"`
	CancellationPolicyHour int       `firestore:"cancellationPolicyHours" json:"cancellationPolicyHours"`
	CreatedAt              time.Time `firestore:"createdAt" json:"createdAt"`
	UpdatedAt              time.Time `firestore:"updatedAt" json:"updatedAt"`
}

type Session struct {
	ID           string    `firestore:"id" json:"id"`
	ClassID      string    `firestore:"classId" json:"classId"`
	InstructorID string    `firestore:"instructorId" json:"instructorId"`
	StartsAt     time.Time `firestore:"startsAt" json:"startsAt"`
	EndsAt       time.Time `firestore:"endsAt" json:"endsAt"`
	TimeZone     string    `firestore:"timeZone" json:"timeZone"`
	Location     string    `firestore:"location" json:"location"`
	Room         string    `firestore:"room" json:"room"`
	Capacity     int       `firestore:"capacity" json:"capacity"`
	BookedCount  int       `firestore:"bookedCount" json:"bookedCount"`
	Price        int64     `firestore:"price" json:"price"`
	Currency     string    `firestore:"currency" json:"currency"`
	Status       string    `firestore:"status" json:"status"`
	CreatedAt    time.Time `firestore:"createdAt" json:"createdAt"`
}

type Booking struct {
	ID               string        `firestore:"id" json:"id"`
	CustomerID       string        `firestore:"customerId" json:"customerId"`
	CustomerName     string        `firestore:"customerName" json:"customerName"`
	CustomerEmail    string        `firestore:"customerEmail" json:"customerEmail"`
	SessionID        string        `firestore:"sessionId" json:"sessionId"`
	ClassID          string        `firestore:"classId" json:"classId"`
	ClassTitle       string        `firestore:"classTitle" json:"classTitle"`
	InstructorName   string        `firestore:"instructorName" json:"instructorName"`
	SessionStartsAt  time.Time     `firestore:"sessionStartsAt" json:"sessionStartsAt"`
	SessionEndsAt    time.Time     `firestore:"sessionEndsAt" json:"sessionEndsAt"`
	BookingReference string        `firestore:"bookingReference" json:"bookingReference"`
	Status           BookingStatus `firestore:"status" json:"status"`
	PaymentStatus    string        `firestore:"paymentStatus" json:"paymentStatus"`
	PriceSnapshot    int64         `firestore:"priceSnapshot" json:"priceSnapshot"`
	Currency         string        `firestore:"currency" json:"currency"`
	IdempotencyKey   string        `firestore:"idempotencyKey,omitempty" json:"idempotencyKey,omitempty"`
	CreatedAt        time.Time     `firestore:"createdAt" json:"createdAt"`
	UpdatedAt        time.Time     `firestore:"updatedAt" json:"updatedAt"`
	CancelledAt      *time.Time    `firestore:"cancelledAt,omitempty" json:"cancelledAt,omitempty"`
}

type Instructor struct {
	ID              string   `firestore:"id" json:"id"`
	Name            string   `firestore:"name" json:"name"`
	Title           string   `firestore:"title" json:"title"`
	Bio             string   `firestore:"bio" json:"bio"`
	ShortBio        string   `firestore:"shortBio" json:"shortBio"`
	Specialties     []string `firestore:"specialties" json:"specialties"`
	Certifications  []string `firestore:"certifications" json:"certifications"`
	ExperienceYears int      `firestore:"experienceYears" json:"experienceYears"`
	ImageURL        string   `firestore:"imageUrl" json:"imageUrl"`
	IsActive        bool     `firestore:"isActive" json:"isActive"`
	Rating          float64  `firestore:"rating" json:"rating"`
	ReviewsCount    int      `firestore:"reviewsCount" json:"reviewsCount"`
}
