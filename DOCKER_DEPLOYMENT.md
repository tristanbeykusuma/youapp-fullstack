# Docker Deployment Guide

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM available
- 10GB disk space

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd youapp-fullstack
```

### 2. Configure Environment Variables

Copy the example environment

```bash
cp .env.example .env
```

Update values in `.env`
- `MONGO_PASSWORD` 
- `RABBITMQ_PASSWORD` 
- `JWT_SECRET` 
- `CORS_ORIGIN`
- `NEXT_PUBLIC_API_URL` 
- `NEXT_PUBLIC_WS_URL`

### 3. Build and Start Services

```bash
# Build all services
docker-compose build

# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Verify Deployment

Check that all services are running:

```bash
docker-compose ps
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api-docs
- RabbitMQ Management: http://localhost:15672 (admin/password)

## Service Architecture

```
┌─────────────────┐
│   Frontend     │
│   (Next.js)    │
│   Port: 3000    │
└────────┬────────┘
         │
         │ HTTP/WebSocket
         ▼
┌─────────────────┐
│    Backend      │
│   (NestJS)     │
│   Port: 3001    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────┐
│ MongoDB │ │ RabbitMQ │
│ :27017  │ │  :5672   │
└─────────┘ └──────────┘
```

## Common Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
docker-compose logs -f rabbitmq
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Restart Services

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Services

```bash
# Rebuild and restart
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Execute Commands in Containers

```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# MongoDB container
docker-compose exec mongodb mongosh

# RabbitMQ container
docker-compose exec rabbitmq sh
```

## Health Checks

- **MongoDB**: `db.runCommand("ping").ok`
- **RabbitMQ**: `rabbitmq-diagnostics -q ping`
- **Backend**: `GET /api/health`
- **Frontend**: `GET /`

Check health status:

```bash
docker-compose ps
```

### Backup Volumes

```bash
# Backup MongoDB
docker run --rm -v youapp-fullstack_mongodb_data:/data -v $(pwd):/backup alpine tar czf /backup/mongodb-backup.tar.gz /data

# Backup uploads
docker run --rm -v youapp-fullstack_backend_uploads:/data -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz /data
```

### Restore Volumes

```bash
# Restore MongoDB
docker run --rm -v youapp-fullstack_mongodb_data:/data -v $(pwd):/backup alpine tar xzf /backup/mongodb-backup.tar.gz -C /

# Restore uploads
docker run --rm -v youapp-fullstack_backend_uploads:/data -v $(pwd):/backup alpine tar xzf /backup/uploads-backup.tar.gz -C /
```

## Production Deployment

### Resource Limits

The docker-compose.yml includes resource limits:

- **Backend**: 1 CPU, 1GB RAM 
- **Frontend**: 0.5 CPU, 512MB RAM

### HTTPS with Let's Encrypt

Use certbot for free SSL certificates:

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal (certbot sets this up automatically)
sudo certbot renew --dry-run
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs <service-name>

# Check if port is in use
netstat -tuln | grep <port>

# Check disk space
df -h
```

### Database Connection Issues

```bash
# Check MongoDB is healthy
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

### High Memory Usage

```bash
# Check resource usage
docker stats
```

### Image Build Failures

```bash
# Clean build cache
docker builder prune -f

# Rebuild without cache
docker-compose build --no-cache
```

## Monitoring

### View Resource Usage

```bash
# Real-time stats
docker stats

# Container info
docker inspect <container-name>
```

### View Logs

```bash
# Follow logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

## Updates

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Update Base Images

```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

## Cleanup

### Remove Unused Resources

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove all unused resources
docker system prune -a --volumes
```
