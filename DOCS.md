# SwiftBank Documentation

Quick reference for setup, deployment, and project structure.

---

## 🚀 Quick Start

### Prerequisites
- Java 17
- Maven 3.8+
- Node.js 16+
- PostgreSQL 12+ (optional, H2 available)

### Setup & Run

**Backend:**
```bash
cd backend
./run-backend.sh
# Or manually: mvn spring-boot:run -Dspring-boot.run.profiles=test
```

**Frontend:**
```bash
cd frontend
./run-frontend.sh
# Or manually: npm install && npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080/api/v1
- API Docs: http://localhost:8080/swagger-ui.html

---

## 📁 Project Structure

```
FullStackBankingSystem/
├── backend/              # Spring Boot (Java 17)
│   ├── src/main/java/
│   │   └── com/bankinghub/backend/
│   │       ├── controller/    # REST APIs
│   │       ├── service/       # Business logic
│   │       ├── repository/    # Data access
│   │       ├── model/         # Entities
│   │       ├── security/      # JWT & auth
│   │       └── config/        # Configuration
│   └── src/main/resources/
│       └── application.yml    # Config
│
├── frontend/             # React 18 + Vite
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API calls
│   │   └── styles/       # CSS
│   └── .env.example      # Environment template
│
└── Documentation files
```

---

## ⚙️ Configuration

**Backend (.env or environment variables):**
```bash
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-key  # Optional
```

**Frontend (.env):**
```bash
VITE_API_URL=http://localhost:8080/api/v1
VITE_ENABLE_DEMO=true
VITE_DEMO_EMAIL=demo@swiftbank.com
VITE_DEMO_PASSWORD=Demo123!
```

---

## 🐳 Docker

```bash
docker-compose up -d --build
```

---

## 📚 More Info

- **README.md** - Full project overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **CONTRIBUTING.md** - How to contribute
- **CHANGELOG.md** - Version history

---

**SwiftBank - Full-Stack Banking System**
