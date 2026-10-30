# Multi-stage Dockerfile for Go Gin Backend
FROM golang:1.23-alpine AS builder

WORKDIR /app
COPY go.mod ./
RUN go mod download || true

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -v -o asana-server ./cmd/server

FROM alpine:latest
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/
COPY --from=builder /app/asana-server .

EXPOSE 8080
ENV PORT=8080
ENV GIN_MODE=release

CMD ["./asana-server"]
