# 🚀 SwiftBank - Deployment Guide

Complete deployment guide for SwiftBank banking application.

## 📋 Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Production Deployment](#production-deployment)
4. [Cloud Deployment](#cloud-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🏠 Local Development

### Prerequisites
- Java 17 (JDK)
- Maven 3.8+
- Node.js 16+
- PostgreSQL 12+ (optional, H2 available)

### Quick Start

**1. Backend (with H2 in-memory database):**
```bash
cd backend
./run-backend.sh
```

**2. Frontend:**
```bash
cd frontend
./run-frontend.sh
```

**3. Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api/v1
- Health Check: http://localhost:8080/actuator/health

---

## 🐳 Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+

### Setup

**1. Configure Environment:**
```bash
# Copy environment template
cp .env.docker .env

# Edit with your values
nano .env
```

**2. Build and Run:**
```bash
# Start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

**3. Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- PostgreSQL: localhost:5432

**4. Management Commands:**
```bash
# Stop services
docker-compose down

# Restart services
docker-compose restart

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in container
docker-compose exec backend bash
docker-compose exec postgres psql -U melvinbank_user -d swiftbank
```

---

## 🌐 Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment

**1. Prepare Server:**
```bash
# Install Java 17
sudo apt update
sudo apt install openjdk-17-jdk

# Verify installation
java -version
```

**2. Build Application:**
```bash
cd backend

# Build JAR file
mvn clean package -DskipTests

# JAR location: target/backend-0.0.1-SNAPSHOT.jar
```

**3. Configure Environment:**
```bash
# Create environment file
sudo nano /etc/melvinbank/backend.env
```

Add:
```bash
SPRING_PROFILES_ACTIVE=prod
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=swiftbank
DB_USERNAME=melvinbank_user
DB_PASSWORD=secure_password_here
JWT_SECRET=your-256-bit-secret-key-minimum-32-characters
OPENAI_API_KEY=sk-your-openai-key
```

**4. Create Systemd Service:**
```bash
sudo nano /etc/systemd/system/melvinbank-backend.service
```

Add:
```ini
[Unit]
Description=SwiftBank Backend
After=network.target

[Service]
Type=simple
User=melvinbank
WorkingDirectory=/opt/melvinbank/backend
EnvironmentFile=/etc/melvinbank/backend.env
ExecStart=/usr/bin/java -jar /opt/melvinbank/backend/backend-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**5. Start Service:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable melvinbank-backend
sudo systemctl start melvinbank-backend
sudo systemctl status melvinbank-backend
```

#### Frontend Deployment

**1. Build Application:**
```bash
cd frontend

# Set production API URL
echo "VITE_API_URL=https://api.melvinbank.com/api/v1" > .env

# Build
npm run build

# Output: dist/ folder
```

**2. Deploy with Nginx:**
```bash
# Install Nginx
sudo apt install nginx

# Copy build files
sudo cp -r dist/* /var/www/melvinbank/

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/melvinbank
```

Add:
```nginx
server {
    listen 80;
    server_name melvinbank.com www.melvinbank.com;
    root /var/www/melvinbank;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**3. Enable and Start:**
```bash
sudo ln -s /etc/nginx/sites-available/melvinbank /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**4. SSL with Let's Encrypt:**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d melvinbank.com -d www.melvinbank.com
```

---

## ☁️ Cloud Deployment

### AWS Deployment

#### Backend on AWS Elastic Beanstalk

**1. Install AWS CLI and EB CLI:**
```bash
pip install awscli awsebcli
aws configure
```

**2. Initialize Elastic Beanstalk:**
```bash
cd backend
eb init -p java-17 melvinbank-backend --region us-east-1
```

**3. Create Environment:**
```bash
eb create melvinbank-prod \
  --instance-type t3.medium \
  --database.engine postgres \
  --database.username melvinbank_user
```

**4. Set Environment Variables:**
```bash
eb setenv \
  SPRING_PROFILES_ACTIVE=prod \
  JWT_SECRET=your-secret-key \
  OPENAI_API_KEY=your-openai-key
```

**5. Deploy:**
```bash
mvn clean package
eb deploy
```

#### Frontend on AWS S3 + CloudFront

**1. Build Frontend:**
```bash
cd frontend
echo "VITE_API_URL=https://api.melvinbank.com/api/v1" > .env
npm run build
```

**2. Create S3 Bucket:**
```bash
aws s3 mb s3://melvinbank-frontend
aws s3 website s3://melvinbank-frontend --index-document index.html
```

**3. Upload Files:**
```bash
aws s3 sync dist/ s3://melvinbank-frontend --delete
```

**4. Create CloudFront Distribution:**
```bash
aws cloudfront create-distribution \
  --origin-domain-name melvinbank-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

### Heroku Deployment

#### Backend

**1. Create Heroku App:**
```bash
cd backend
heroku create melvinbank-backend
heroku addons:create heroku-postgresql:hobby-dev
```

**2. Set Environment Variables:**
```bash
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set JWT_SECRET=your-secret-key
heroku config:set OPENAI_API_KEY=your-openai-key
```

**3. Deploy:**
```bash
git push heroku main
```

#### Frontend

**1. Create Heroku App:**
```bash
cd frontend
heroku create melvinbank-frontend
```

**2. Add Buildpack:**
```bash
heroku buildpacks:set heroku/nodejs
```

**3. Set Environment:**
```bash
heroku config:set VITE_API_URL=https://melvinbank-backend.herokuapp.com/api/v1
```

**4. Deploy:**
```bash
git push heroku main
```

---

## ⚙️ Environment Configuration

### Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | Yes | test | Profile: test, dev, prod |
| `DB_HOST` | Prod | localhost | Database host |
| `DB_PORT` | Prod | 5432 | Database port |
| `DB_NAME` | Prod | swiftbank | Database name |
| `DB_USERNAME` | Prod | - | Database username |
| `DB_PASSWORD` | Prod | - | Database password |
| `JWT_SECRET` | Yes | - | JWT signing key (256-bit) |
| `JWT_EXPIRATION` | No | 86400000 | Token expiration (ms) |
| `OPENAI_API_KEY` | No | - | OpenAI API key for AI support |
| `SMTP_HOST` | Prod | - | Email server host |
| `SMTP_PORT` | Prod | 587 | Email server port |
| `SMTP_USERNAME` | Prod | - | Email username |
| `SMTP_PASSWORD` | Prod | - | Email password |

### Frontend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | http://localhost:8080/api/v1 | Backend API URL |
| `VITE_ENABLE_DEMO` | No | false | Enable demo mode |
| `VITE_DEMO_EMAIL` | No | - | Demo login email |
| `VITE_DEMO_PASSWORD` | No | - | Demo login password |
| `VITE_GA_MEASUREMENT_ID` | No | - | Google Analytics ID |
| `VITE_APP_NAME` | No | SwiftBank | Application name |
| `VITE_APP_VERSION` | No | 2.0.0 | Application version |

---

## 📊 Monitoring & Maintenance

### Health Checks

**Backend:**
```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/metrics
```

**Frontend:**
```bash
curl http://localhost:5173
```

### Logs

**Backend (Systemd):**
```bash
sudo journalctl -u melvinbank-backend -f
```

**Backend (Docker):**
```bash
docker-compose logs -f backend
```

**Nginx:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Database Backup

**PostgreSQL:**
```bash
# Backup
pg_dump -U melvinbank_user swiftbank > backup_$(date +%Y%m%d).sql

# Restore
psql -U melvinbank_user swiftbank < backup_20250101.sql
```

**Automated Backup Script:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/melvinbank"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U melvinbank_user swiftbank | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

### Performance Monitoring

**Install monitoring tools:**
```bash
# Prometheus + Grafana
docker run -d -p 9090:9090 prom/prometheus
docker run -d -p 3001:3000 grafana/grafana
```

**Spring Boot Actuator endpoints:**
- `/actuator/health` - Health status
- `/actuator/metrics` - Application metrics
- `/actuator/info` - Application info
- `/actuator/prometheus` - Prometheus metrics

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret (256-bit minimum)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Enable application logging
- [ ] Configure rate limiting
- [ ] Set up monitoring alerts
- [ ] Review CORS settings
- [ ] Disable demo mode in production
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable database encryption at rest
- [ ] Set up intrusion detection

---

## 📞 Support

For deployment issues:
- 📧 Email: melvinchibanda@gmail.com
- 📚 Documentation: See README.md and other docs
- 🐛 Issues: Create GitHub issue

---

**SwiftBank - Deployment Guide v2.0**

*Built with ❤️ in Zambia by Melvin Musonda Chibanda*
