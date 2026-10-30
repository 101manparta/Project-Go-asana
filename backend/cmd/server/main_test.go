package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestHealthEndpoint(t *testing.T) {
	router := SetupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/health", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var resp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}

	if resp["service"] != "asana-go-backend" {
		t.Fatalf("expected service 'asana-go-backend', got %v", resp["service"])
	}
	if resp["status"] != "healthy" {
		t.Fatalf("expected status 'healthy', got %v", resp["status"])
	}
}

func TestPublicClassesEndpoint(t *testing.T) {
	router := SetupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/classes", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}

func TestAdminEndpoint_RejectionWithoutAuth(t *testing.T) {
	router := SetupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/admin/dashboard", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("expected status 403 Forbidden without credentials, got %d", w.Code)
	}
}

func TestAdminEndpoint_RejectionForCustomerRole(t *testing.T) {
	router := SetupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/admin/dashboard", nil)
	req.Header.Set("X-User-Role", "CUSTOMER")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusForbidden {
		t.Fatalf("expected status 403 Forbidden for customer role, got %d", w.Code)
	}
}

func TestAdminEndpoint_AuthorizedForAdmin(t *testing.T) {
	router := SetupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/admin/dashboard", nil)
	req.Header.Set("X-User-Role", "ADMIN")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for admin role, got %d", w.Code)
	}
}

func TestAdminEndpoint_AuthorizedForSuperAdmin(t *testing.T) {
	router := SetupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/admin/bookings", nil)
	req.Header.Set("X-User-Role", "SUPER_ADMIN")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for super admin role, got %d", w.Code)
	}
}

func TestAdminEndpoint_AuthorizedForBearerToken(t *testing.T) {
	router := SetupRouter()
	req, _ := http.NewRequest(http.MethodGet, "/api/v1/admin/dashboard", nil)
	req.Header.Set("Authorization", "Bearer demo-admin-token")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200 OK for demo admin token, got %d", w.Code)
	}
}
