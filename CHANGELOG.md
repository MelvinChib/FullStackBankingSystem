# Changelog

All notable changes to SwiftBank will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2025-01-XX

### 🔒 Security (CRITICAL)

#### Fixed
- **Removed all hardcoded credentials** from source code
  - Externalized demo credentials to environment variables (`VITE_DEMO_EMAIL`, `VITE_DEMO_PASSWORD`)
  - Removed hardcoded JWT tokens
  - Removed hardcoded database credentials
  - All sensitive data now uses environment variables

- **SQL Injection Protection**
  - Enhanced `ValidationUtils` with SQL injection pattern detection
  - All database queries use JPA parameterized queries
  - Input sanitization on all user inputs

- **XSS (Cross-Site Scripting) Protection**
  - Added XSS pattern detection in `ValidationUtils`
  - Input sanitization for all user-generated content
  - Output encoding in frontend components

- **Enhanced Error Handling**
  - Rewrote `GlobalExceptionHandler` with security-focused error responses
  - No sensitive information leaked in error messages
  - Client IP tracking for security auditing
  - Structured error responses

- **CSRF Protection**
  - Spring Security CSRF tokens enabled
  - Secure cookie configuration
  - SameSite cookie policy

- **Security Headers**
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - X-XSS-Protection: 1; mode=block
  - Content-Security-Policy configured
  - HSTS (HTTP Strict Transport Security)

#### Added
- `SecurityProperties.java` - Centralized security configuration
- Enhanced `ValidationUtils` with security patterns
- Comprehensive security documentation (`SECURITY_CONFIGURATION.md`)
- Security audit report (`SECURITY_AUDIT_COMPLETE.md`)

### 🐛 Bug Fixes

#### Backend
- **Java Version Compatibility**
  - Changed from Java 21 to Java 17 in `pom.xml`
  - Fixed compilation errors due to version mismatch
  - Updated Maven compiler plugin configuration

- **Code Quality**
  - Removed redundant manual getters/setters (Lombok `@Data` handles this)
    - `User.java`
    - `Account.java`
  - Fixed validation constraints in `BillRequestDTO.java`
    - Changed `@Future` to `@FutureOrPresent` for `dueDate` field
  - Fixed unclosed string literals in `CustomerSupportService.java`
  - Removed duplicate imports

#### Frontend
- Fixed API service to use environment variables
- Corrected demo mode implementation
- Fixed login component to read from environment

### 🏗️ Project Structure

#### Removed
- **Mixed Frontend/Backend Code** (Critical cleanup)
  - Deleted `backend/server.js` (Node.js server in Spring Boot project)
  - Removed React components from `backend/src/` directory
  - Removed Java files from `frontend/src/` directory
  - Cleaned up misplaced configuration files

#### Added
- Helper scripts for easy startup:
  - `backend/run-backend.sh` - Backend startup script
  - `frontend/run-frontend.sh` - Frontend startup script
- Environment configuration templates:
  - `frontend/.env.example` - Frontend environment template
  - `.env.docker` - Docker environment template
- Comprehensive documentation:
  - `DEPLOYMENT.md` - Complete deployment guide
  - `QUICK_START.md` - Fast setup instructions
  - `PROJECT_STRUCTURE.md` - Architecture documentation
  - `FIXES_APPLIED.md` - Detailed fix documentation
  - `SECURITY_AUDIT_COMPLETE.md` - Security compliance summary
  - `SECURITY_CONFIGURATION.md` - Production security setup

### 📚 Documentation

#### Enhanced
- **README.md** - Complete rewrite with:
  - Step-by-step setup instructions
  - Troubleshooting guide
  - Configuration examples
  - Docker deployment instructions
  - GitHub push instructions
  - Security features documentation

#### Added
- Comprehensive deployment guide
- Security configuration guide
- Quick start guide
- Project structure documentation
- Changelog (this file)

### ⚙️ Configuration

#### Backend
- Created profile-specific configurations:
  - `application-test.yml` - H2 in-memory database
  - `application-dev.yml` - PostgreSQL development
  - `application-prod.yml` - PostgreSQL production
- Externalized all sensitive configuration to environment variables
- Added `SecurityProperties` for centralized security settings

#### Frontend
- Created `.env.example` with all required variables
- Removed hardcoded values from source code
- Added support for multiple environment configurations

### 🐳 Docker

#### Enhanced
- Rewrote `docker-compose.yml` with:
  - Environment variable support
  - Health checks for all services
  - Proper service dependencies
  - Volume management
  - Network configuration

#### Added
- Multi-stage Dockerfiles for both backend and frontend
- Non-root user configuration for security
- Optimized layer caching
- Production-ready configurations

### 🧪 Testing

#### Fixed
- Test profile configuration for H2 database
- Fixed test data initialization
- Corrected validation test cases

### 📦 Dependencies

#### Backend
- Maintained Spring Boot 3.2.0
- Java 17 (changed from 21)
- All dependencies up to date

#### Frontend
- React 18
- Vite 4.x
- Tailwind CSS 3.x
- All dependencies audited and updated

---

## [1.2.0] - 2024-01-XX

### Added
- Statement export functionality (PDF, CSV, Text)
- Date range filtering for statements
- Professional PDF formatting with bank letterhead
- CSV export for spreadsheet analysis
- Text export for plain text statements

---

## [1.1.0] - 2024-01-XX

### Added
- AI-powered customer support chatbot
- OpenAI integration for intelligent responses
- Fallback responses when AI is unavailable
- Support categories and quick help topics
- Context-aware banking assistance

---

## [1.0.0] - 2024-01-XX

### Added
- Initial release of SwiftBank
- User registration and authentication (JWT)
- Multi-account management (Checking, Savings, Credit Card, Loan, Investment)
- Transaction processing
- Bill management and payments
- Budget tracking with categories
- Fund transfers (internal and external)
- React 18 frontend with Tailwind CSS
- Spring Boot 3.2 backend
- PostgreSQL database support
- H2 in-memory database for testing
- Role-based access control
- Password encryption (BCrypt)
- Input validation
- CORS protection
- Responsive mobile-first design
- FNB-inspired UI theme

---

## Migration Guide

### Upgrading from v1.x to v2.0

#### Backend

1. **Update Java Version:**
   ```bash
   # Ensure Java 17 is installed
   java -version
   ```

2. **Set Environment Variables:**
   ```bash
   # Create environment file
   export DB_USERNAME=your_username
   export DB_PASSWORD=your_password
   export JWT_SECRET=your-256-bit-secret
   ```

3. **Rebuild Application:**
   ```bash
   cd backend
   mvn clean install
   ```

#### Frontend

1. **Create .env File:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your values
   ```

2. **Remove Old Configuration:**
   ```bash
   # Remove any hardcoded credentials from custom code
   # Update API calls to use environment variables
   ```

3. **Reinstall Dependencies:**
   ```bash
   npm install
   ```

#### Database

No schema changes required. Existing data is compatible.

#### Docker

1. **Update docker-compose.yml:**
   ```bash
   # Use the new docker-compose.yml from v2.0
   cp docker-compose.yml.new docker-compose.yml
   ```

2. **Create .env.docker:**
   ```bash
   cp .env.docker.example .env.docker
   # Edit with your values
   ```

3. **Rebuild Containers:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

---

## Security Advisories

### v1.x - CRITICAL Security Issues (Fixed in v2.0)

**⚠️ Users of v1.x should upgrade immediately to v2.0**

#### Issues Fixed:
1. **Hardcoded Credentials** - Demo credentials and tokens were hardcoded in source code
2. **Information Leakage** - Error messages exposed sensitive system information
3. **Missing Input Validation** - Some endpoints lacked proper input sanitization
4. **Weak Error Handling** - Stack traces exposed in production

#### Mitigation:
- Upgrade to v2.0 immediately
- Rotate all JWT secrets
- Change all database passwords
- Review access logs for suspicious activity

---

## Deprecations

### v2.0
- None

### v1.x
- Hardcoded demo credentials (removed in v2.0)
- Direct credential storage in source code (removed in v2.0)

---

## Known Issues

### v2.0
- None reported

### v1.x
- Port conflicts when multiple instances run (Fixed in v2.0 with better documentation)
- Java version compatibility issues (Fixed in v2.0 with Java 17)

---

## Contributors

- **Melvin Musonda Chibanda** - Lead Developer
  - Email: melvinchibanda@gmail.com
  - GitHub: [@melvinchibanda]

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**For detailed information about each release, see the [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md) files.**

*SwiftBank - Banking Made Simple & Secure* 🇿🇲
