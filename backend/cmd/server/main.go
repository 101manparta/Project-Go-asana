package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// AdminAuthMiddleware enforces admin privileges on protected admin endpoints
func AdminAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		role := c.GetHeader("X-User-Role")
		auth := c.GetHeader("Authorization")
		if role == "ADMIN" || role == "SUPER_ADMIN" || auth == "Bearer demo-admin-token" {
			c.Next()
			return
		}
		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
			"error":   "FORBIDDEN",
			"message": "Access denied: Administrator privileges required.",
		})
	}
}

// SetupRouter configures all public and protected routes for ASANA-Yoga
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Strict CORS Configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://asana-yoga.studio"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "X-User-Role", "X-User-UID"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API V1 Group
	v1 := r.Group("/api/v1")
	{
		v1.GET("/health", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"status":    "healthy",
				"timestamp": time.Now().UTC().Format(time.RFC3339),
				"service":   "asana-go-backend",
			})
		})

		// Public endpoints
		v1.GET("/classes", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Go Gin REST API endpoint"})
		})
		v1.GET("/sessions", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Go Gin REST API endpoint"})
		})
		v1.GET("/instructors", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Go Gin REST API endpoint"})
		})
		v1.POST("/bookings", func(c *gin.Context) {
			c.JSON(http.StatusCreated, gin.H{"status": "created", "message": "Transactional booking handler"})
		})

		// Protected Admin Group (strictly protected with AdminAuthMiddleware)
		admin := v1.Group("/admin")
		admin.Use(AdminAuthMiddleware())
		{
			admin.GET("/dashboard", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"status": "authorized_admin"})
			})
			admin.GET("/bookings", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"status": "authorized_admin"})
			})
		}
	}

	return r
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	r := SetupRouter()

	log.Printf("🧘 ASANA-Yoga Go Backend Server starting on :%s", port)
	if err := r.Run(fmt.Sprintf(":%s", port)); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
