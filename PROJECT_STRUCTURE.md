# MelvinBank Zambia - Project Structure

## 📁 Project Overview

This is a full-stack banking application with a clear separation between frontend and backend components.

```
melvinbank-zambia-app-master/
├── 📁 backend/                 # Spring Boot Backend (Java 21)
│   ├── 📁 src/main/java/       # Java source code
│   │   └── com/bankinghub/backend/
│   │       ├── 🏛️ controller/   # REST Controllers
│   │       ├── 🔧 service/      # Business Logic Layer
│   │       ├── 🗃️ repository/   # Data Access Layer (JPA)
│   │       ├── 📊 model/        # JPA Entities
│   │       ├── 🔄 dto/          # Data Transfer Objects
│   │       │   ├── request/     # Request DTOs
│   │       │   └── response/    # Response DTOs
│   │       ├── 🔐 security/     # Security Configuration
│   │       ├── ⚙️ config/       # Application Configuration
│   │       ├── 🚨 exception/    # Exception Handling
│   │       ├── 🗺️ mapper/       # MapStruct Mappers
│   │       └── 🛠️ util/         # Utility Classes
│   ├── 📋 src/main/resources/
│   │   ├── application.yml     # Configuration Properties
│   │   ├── data.sql           # Initial Data (H2 profile)
│   │   └── templates/         # Email Templates (Thymeleaf)
│   ├── 📋 src/test/           # Unit & Integration Tests
│   └── 🔨 pom.xml             # Maven Dependencies
│
├── 📁 frontend/               # React Frontend (Vite)
│   ├── 📁 src/
│   │   ├── 🧩 components/     # Reusable React Components
│   │   │   ├── ui/           # UI Components (Button, Input, etc.)
│   │   │   └── auth/         # Authentication Components
│   │   ├── 📱 pages/         # Page Components
│   │   ├── 🔌 services/      # API Integration Layer
│   │   ├── 🎨 styles/        # CSS & Styling
│   │   └── 🛠️ utils/         # Utility Functions
│   ├── 📁 public/            # Static Assets
│   ├── 📦 package.json       # Node Dependencies
│   └── ⚙️ vite.config.mjs    # Vite Configuration
│
├── 🐳 docker-compose.yml     # Docker Orchestration
├── 📜 start-app.sh          # Quick Start Script
└── 📖 README.md             # Project Documentation
```

## 🏗️ Architecture Principles

### Backend (Spring Boot)
- **Layered Architecture**: Clear separation of concerns
- **Domain-Driven Design**: Business logic encapsulated in services
- **Repository Pattern**: Data access abstraction
- **DTO Pattern**: API contract separation from domain models
- **Security-First**: JWT authentication, CSRF protection, input validation

### Frontend (React)
- **Component-Based**: Reusable UI components
- **Service Layer**: API abstraction
- **Environment Configuration**: Secure configuration management
- **Responsive Design**: Mobile-first approach

## 🔒 Security Best Practices

### Backend Security
- ✅ JWT token authentication
- ✅ BCrypt password hashing (strength 12)
- ✅ Input validation with Jakarta Bean Validation
- ✅ CORS configuration
- ✅ SQL injection protection via JPA
- ✅ Role-based access control

### Frontend Security
- ✅ Environment-based configuration
- ✅ No hardcoded credentials
- ✅ Secure token storage
- ✅ Input sanitization
- ✅ HTTPS enforcement (production)

## 🚀 Development Workflow

### Backend Development
1. **Models**: Define JPA entities in `model/`
2. **DTOs**: Create request/response DTOs in `dto/`
3. **Repositories**: Add data access in `repository/`
4. **Services**: Implement business logic in `service/`
5. **Controllers**: Create REST endpoints in `controller/`
6. **Tests**: Write unit/integration tests

### Frontend Development
1. **Components**: Create reusable components in `components/`
2. **Pages**: Build page components in `pages/`
3. **Services**: Add API integration in `services/`
4. **Styling**: Use Tailwind CSS classes
5. **Testing**: Write component tests

## 📋 Configuration Management

### Backend Configuration
- **Profiles**: `dev`, `test`, `prod`
- **Environment Variables**: Database, JWT, email settings
- **Application Properties**: `application.yml`

### Frontend Configuration
- **Environment Files**: `.env`, `.env.local`, `.env.production`
- **Build Configuration**: `vite.config.mjs`
- **Feature Flags**: Environment-based feature toggles

## 🧪 Testing Strategy

### Backend Testing
- **Unit Tests**: Service layer testing
- **Integration Tests**: Repository and controller testing
- **Security Tests**: Authentication and authorization testing

### Frontend Testing
- **Component Tests**: React component testing with Vitest
- **Integration Tests**: API integration testing
- **E2E Tests**: User workflow testing

## 📦 Deployment

### Development
```bash
# Backend
cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=test

# Frontend
cd frontend && npm run dev
```

### Production
```bash
# Backend
mvn clean package -Dspring.profiles.active=prod
java -jar target/melvinbank-backend-1.0.0.jar

# Frontend
npm run build
# Deploy build/ folder to web server
```

### Docker
```bash
docker-compose up -d
```

## 🔧 Code Quality Standards

### Java (Backend)
- **Lombok**: Reduce boilerplate code
- **MapStruct**: Type-safe mapping between DTOs and entities
- **SonarQube**: Code quality analysis
- **Checkstyle**: Code style enforcement

### JavaScript (Frontend)
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

## 📚 Documentation

- **API Documentation**: Swagger/OpenAPI at `/swagger-ui.html`
- **Code Documentation**: JavaDoc for backend, JSDoc for frontend
- **Architecture Documentation**: This file and README.md

## 🔄 Version Control

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `hotfix/*`: Production fixes

### Commit Convention
```
type(scope): description

feat(auth): add JWT token refresh
fix(api): resolve CORS configuration issue
docs(readme): update installation instructions
```

## 🚨 Troubleshooting

### Common Issues
1. **Port Conflicts**: Backend (8080), Frontend (5173)
2. **Database Connection**: Check PostgreSQL/H2 configuration
3. **CORS Errors**: Verify allowed origins in SecurityConfig
4. **Build Failures**: Check Java/Node versions

### Debug Mode
```bash
# Backend debug
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"

# Frontend debug
npm run dev -- --debug
```

This structure ensures maintainability, scalability, and security while following industry best practices.