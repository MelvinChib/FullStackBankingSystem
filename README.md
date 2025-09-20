# 🏦 MelvinBank Zambia - Complete Banking Application

A comprehensive full-stack banking application featuring a **React frontend** and **Spring Boot backend** with advanced features including AI customer support, multi-format statement exports, and real-time banking operations.

![MelvinBank Zambia](https://img.shields.io/badge/MelvinBank-Zambia-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue.svg)

## 🌟 **Key Features**

### 🔐 **Authentication & Security**
- ✅ JWT-based authentication with secure token management
- ✅ Password encryption (BCrypt with strength 12)
- ✅ Role-based access control (User/Admin)
- ✅ Input validation and sanitization
- ✅ CORS protection and security headers

### 🏦 **Core Banking Features**
- ✅ **Multi-Account Management**: Checking, Savings, Credit Card, Loan, Investment accounts
- ✅ **Account Operations**: Create, view, update, and deactivate accounts
- ✅ **Transaction Processing**: Comprehensive transaction management
- ✅ **Bill Management**: Schedule and pay bills with auto-pay options
- ✅ **Budget Tracking**: Category-based budgeting with alerts
- ✅ **Fund Transfers**: Internal and external money transfers

### 🤖 **AI Customer Support**
- ✅ **Intelligent Chatbot**: AI-powered customer support with natural language processing
- ✅ **Context-Aware Responses**: Banking-specific knowledge base
- ✅ **Quick Help Topics**: Pre-defined common queries
- ✅ **Human Agent Escalation**: Automatic detection of complex issues
- ✅ **Category-Based Support**: Organized support by banking topics

### 📄 **Advanced Statement Export**
- ✅ **PDF Export**: Professional formatted statements with bank letterhead
- ✅ **CSV Export**: Spreadsheet-compatible data for analysis
- ✅ **Text Export**: Plain text format with transaction summaries
- ✅ **Date Range Filtering**: Custom period selection
- ✅ **Account Selection**: Export statements for any account

### 🎨 **Modern Frontend**
- ✅ **React 18**: Latest React features with hooks and context
- ✅ **Tailwind CSS**: Responsive, utility-first styling
- ✅ **Real-time Updates**: Dynamic UI updates
- ✅ **Mobile Responsive**: Optimized for all device sizes
- ✅ **Intuitive UX**: User-friendly interface design

### 🚀 **Backend Architecture**
- ✅ **Spring Boot 3.2**: Modern Java framework
- ✅ **Layered Architecture**: Clear separation of concerns
- ✅ **JPA/Hibernate**: Advanced ORM with relationships
- ✅ **Global Exception Handling**: Structured error responses
- ✅ **API Documentation**: Swagger/OpenAPI integration

## 🏗️ **Architecture Overview**

```
MelvinBank Zambia App/
├── 📁 backend/                 # Spring Boot Backend
│   ├── 🔧 src/main/java/       # Java source code
│   │   └── com/bankinghub/backend/
│   │       ├── 🏛️ controller/   # REST Controllers
│   │       ├── 🔧 service/      # Business Logic
│   │       ├── 🗃️ repository/   # Data Access Layer
│   │       ├── 📊 model/        # JPA Entities
│   │       ├── 🔄 dto/          # Data Transfer Objects
│   │       ├── 🔐 security/     # Security Configuration
│   │       └── ⚙️ config/       # Application Configuration
│   ├── 📋 src/main/resources/
│   │   └── application.yml     # Configuration Properties
│   └── 🔨 pom.xml              # Maven Dependencies
│
├── 📁 frontend/                # React Frontend
│   ├── 📁 src/
│   │   ├── 🧩 components/      # React Components
│   │   ├── 🔌 services/        # API Integration
│   │   ├── 🎨 styles/          # CSS & Styling
│   │   └── 📱 pages/           # Application Pages
│   ├── 📁 public/              # Static Assets
│   └── 📦 package.json         # Node Dependencies
│
└── 📖 README.md               # This file
```

## 🚀 **Quick Start Guide**

### **Prerequisites**
- ☕ **Java 17** or higher
- 🔧 **Maven 3.8+**
- 🐘 **PostgreSQL 12+** (or H2 for testing)
- 🟢 **Node.js 16+** and **npm/yarn**
- 📝 **Git**

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd "MelvinBank Zambia App"
```

### **2. Setup Backend**

#### **Database Setup**
```bash
# Option A: PostgreSQL (Recommended)
createdb melvinbank_zambia
# Update application.yml with your credentials

# Option B: Use H2 for quick testing
# No setup required - uses in-memory database
```

#### **Run Backend**
```bash
cd backend

# Set environment variables (optional)
export DB_USERNAME=your_username
export DB_PASSWORD=your_password
export JWT_SECRET=your-secure-secret-key

# Run with H2 (for testing)
mvn spring-boot:run -Dspring-boot.run.profiles=test

# Or run with PostgreSQL
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

**Backend will be available at:** `http://localhost:8080/api/v1`

### **3. Setup Frontend**
```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
echo "REACT_APP_API_URL=http://localhost:8080/api/v1" > .env

# Start development server
npm start
```

**Frontend will be available at:** `http://localhost:3000`

### **4. Access the Application**

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8080/api/v1
- 📚 **API Documentation**: http://localhost:8080/api/v1/swagger-ui.html
- ❤️ **Health Check**: http://localhost:8080/api/v1/auth/health

## 📱 **Application Features Demo**

### **1. User Registration & Login**
```bash
# Register new user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### **2. Account Management**
```bash
# Create new account
curl -X POST http://localhost:8080/api/v1/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "accountType": "CHECKING",
    "accountName": "My Checking Account",
    "initialBalance": 1000.00
  }'

# Get user accounts
curl -X GET http://localhost:8080/api/v1/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **3. AI Customer Support**
```bash
# Ask AI support question
curl -X POST http://localhost:8080/api/v1/customer-support/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I transfer money between accounts?",
    "category": "Transactions & Transfers"
  }'
```

### **4. Export Statements**
```bash
# Export PDF statement
curl -X GET "http://localhost:8080/api/v1/accounts/1/statement/pdf?fromDate=2024-01-01T00:00:00&toDate=2024-12-31T23:59:59" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output statement.pdf

# Export CSV statement  
curl -X GET "http://localhost:8080/api/v1/accounts/1/statement/csv" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output statement.csv
```

## 🔧 **Configuration**

### **Backend Configuration (application.yml)**
```yaml
# Database
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/melvinbank_zambia
    username: ${DB_USERNAME:melvinbank_user}
    password: ${DB_PASSWORD:secure_password}

# JWT Configuration
app:
  jwt:
    secret: ${JWT_SECRET:your-very-long-secure-secret}
    expiration: 86400000  # 24 hours

# AI Support (Optional)
  ai:
    openai:
      api-key: ${OPENAI_API_KEY:your-openai-key}
```

### **Frontend Configuration (.env)**
```bash
REACT_APP_API_URL=http://localhost:8080/api/v1
REACT_APP_APP_NAME=MelvinBank Zambia
REACT_APP_VERSION=1.0.0
```

## 🌍 **Deployment**

### **Production Deployment**

#### **Backend Deployment**
```bash
# Build for production
cd backend
mvn clean package -Dspring.profiles.active=prod

# Deploy JAR file
java -jar -Dspring.profiles.active=prod target/melvinbank-backend-1.0.0.jar
```

#### **Frontend Deployment**
```bash
# Build for production
cd frontend
npm run build

# Deploy build folder to web server
# Copy build/ folder to your web server
```

#### **Docker Deployment (Optional)**
```bash
# Backend Dockerfile
FROM openjdk:17-jdk-slim
COPY target/melvinbank-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]

# Frontend Dockerfile  
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 **API Documentation**

### **Core Endpoints**

#### **🔐 Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

#### **🏦 Account Management**
- `GET /accounts` - List user accounts
- `POST /accounts` - Create new account
- `GET /accounts/{id}` - Get account details
- `PUT /accounts/{id}` - Update account
- `DELETE /accounts/{id}` - Delete account

#### **🤖 Customer Support**
- `POST /customer-support/chat` - AI chat support
- `GET /customer-support/categories` - Support categories
- `GET /customer-support/quick-help` - Quick help topics

#### **📄 Statement Export**
- `GET /accounts/{id}/statement/pdf` - Export PDF statement
- `GET /accounts/{id}/statement/csv` - Export CSV statement
- `GET /accounts/{id}/statement/text` - Export text statement

## 🧪 **Testing**

### **Backend Testing**
```bash
cd backend

# Run all tests
mvn test

# Run with test profile (H2 database)
mvn test -Dspring.profiles.active=test

# Run with coverage
mvn clean test jacoco:report
```

### **Frontend Testing**
```bash
cd frontend

# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e
```

## 📈 **Performance & Monitoring**

- **Backend Monitoring**: Spring Actuator endpoints at `/actuator/health`, `/actuator/metrics`
- **Database Connection Pooling**: HikariCP for optimal performance
- **Caching**: Spring Cache with configurable providers
- **Logging**: Structured logging with SLF4J and Logback

## 🔒 **Security Features**

- **JWT Authentication**: Stateless authentication with configurable expiration
- **Password Security**: BCrypt hashing with strength 12
- **Input Validation**: Jakarta Bean Validation with custom validators
- **SQL Injection Protection**: Parameterized queries via JPA
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Built-in Spring Security protections

## 🛠️ **Technology Stack**

### **Backend Technologies**
| Category | Technology | Version |
|----------|------------|---------|
| **Language** | Java | 17 |
| **Framework** | Spring Boot | 3.2.0 |
| **Security** | Spring Security + JWT | 6.x |
| **Database** | PostgreSQL / H2 | 12+ / 2.x |
| **ORM** | JPA/Hibernate | 6.x |
| **Build Tool** | Maven | 3.8+ |
| **Documentation** | SpringDoc OpenAPI | 2.2.0 |
| **PDF Generation** | iText7 | 7.2.5 |

### **Frontend Technologies**
| Category | Technology | Version |
|----------|------------|---------|
| **Language** | JavaScript/JSX | ES2022 |
| **Framework** | React | 18 |
| **Build Tool** | Vite | 4.x |
| **Styling** | Tailwind CSS | 3.x |
| **State Management** | React Context/Hooks | 18 |
| **HTTP Client** | Fetch API | Native |
| **Routing** | React Router | 6.x |

## 👨‍💻 **Development Team**

**Lead Developer:** Melvin Musonda Chibanda
- 📧 Email: melvinchibanda@gmail.com
- 🐙 GitHub: [melvinchibanda]
- 🌍 Location: Zambia

## 📄 **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🤝 **Contributing**

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. ✅ Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔀 Open a Pull Request

## 📞 **Support**

For support and questions:
- 📧 **Email**: melvinchibanda@gmail.com
- 📞 **Phone**: +260-XXX-XXXX
- 🎫 **Issues**: Create an issue in this repository
- 📚 **Documentation**: Check the `/docs` folder for detailed documentation

## 🔄 **Version History**

| Version | Date | Description |
|---------|------|-------------|
| **v1.0.0** | 2024-01-XX | Initial release with core banking features |
| **v1.1.0** | 2024-01-XX | Added AI customer support |
| **v1.2.0** | 2024-01-XX | Added statement export functionality |

---

## 🌟 **Why Choose MelvinBank Zambia?**

- 🏆 **100% Local**: Built specifically for Zambian banking needs
- 🔒 **Bank-Grade Security**: Enterprise-level security protocols
- 🤖 **AI-Powered**: Modern AI customer support system
- 📱 **Mobile-First**: Responsive design for all devices
- ⚡ **Fast & Reliable**: High-performance architecture
- 🔧 **Developer-Friendly**: Well-documented and maintainable code
- 🌍 **Open Source**: Community-driven development

**MelvinBank Zambia - Banking Made Simple** 🇿🇲

---

*Built with ❤️ in Zambia by Melvin Musonda Chibanda*