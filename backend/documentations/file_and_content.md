# File and Content

This document explains what each main Java file in your Spring Boot project should contain and what its code is supposed to do. Use this as a blueprint for writing your actual code.



# Detailed Implementation Guidance for Each File

## 1. controller/

- **UserController.java**: 
Exposes endpoints for user registration, login, profile retrieval, and update. Validates input using @Valid, returns appropriate HTTP status codes, and handles authentication tokens. Delegates all business logic to UserService.

- **AccountController.java**: 
Exposes endpoints to list all accounts for a user, fetch account details, create new accounts, and get account insights. Handles request parameters for filtering and pagination. Delegates to AccountService.

- **TransactionController.java**: 
Exposes endpoints to list, filter, and create transactions, and to export transaction data (CSV/PDF). Handles query parameters for filtering (date, type, amount). Delegates to TransactionService.

- **BillController.java**: 
Exposes endpoints for CRUD operations on bills and payees, paying bills, and retrieving payment history. Validates bill/payee ownership. Delegates to BillService.

- **BudgetController.java**: 
Exposes endpoints for CRUD operations on budgets, tracking progress, and sending spending alerts. Handles requests for budget analytics. Delegates to BudgetService.

- **TransferController.java**: 
Exposes endpoints to initiate fund transfers, list recent transfers, and fetch transfer details. Validates transfer requests and returns confirmation. Delegates to TransferService.

- **AuthController.java**: 
Exposes endpoints for login, logout, and 2FA verification. Issues JWT tokens on successful login. Delegates to AuthService.

## 2. service/

- **UserService.java**: 
Handles user registration (including password hashing), login (authentication and JWT generation), profile updates, and 2FA logic. Validates business rules (e.g., unique email).

- **AccountService.java**: 
Handles account creation, retrieval, and calculation of financial insights (total balance, spending trends). Ensures accounts belong to the requesting user.

- **TransactionService.java**: 
Handles creation, filtering, and export of transactions. Ensures transactions are linked to the correct account and user. Aggregates data for charts and analytics.

- **BillService.java**: 
Handles CRUD for bills and payees, schedules and executes bill payments, tracks payment status/history, and manages auto-pay settings.

- **BudgetService.java**: 
Handles CRUD for budgets, tracks spending per category, triggers alerts when nearing/exceeding limits, and provides analytics for budget progress.

- **TransferService.java**: 
Handles validation and execution of fund transfers, ensures atomic updates to account balances, and records transfer history.

- **AuthService.java**: 
Handles authentication, JWT token creation/validation, and 2FA verification. Integrates with Spring Security.

## 3. repository/

- **UserRepository.java**: 
Extends JpaRepository. Provides methods to find users by email, id, etc. Used by UserService and AuthService.

- **AccountRepository.java**: 
Extends JpaRepository. Provides methods to find accounts by user, id, etc. Used by AccountService.

- **TransactionRepository.java**: 
Extends JpaRepository. Provides methods to filter transactions by account, date, type, etc. Used by TransactionService.

- **BillRepository.java**: 
Extends JpaRepository. Provides methods to find bills by user, status, due date, etc. Used by BillService.

- **BudgetRepository.java**: 
Extends JpaRepository. Provides methods to find budgets by user, category, etc. Used by BudgetService.

- **TransferRepository.java**:
Extends JpaRepository. Provides methods to find transfers by user, account, etc. Used by TransferService.

## 4. model/ (or entity/)

- **User.java**: 
JPA entity. Fields: id, name, email, password, 2FA secret, etc. Relationships: OneToMany with Account, Bill, Budget, etc. Used by repositories and services.

- **Account.java**: 
JPA entity. Fields: id, userId, type, balance, etc. Relationships: ManyToOne with User, OneToMany with Transaction, Transfer.

- **Transaction.java**: 
JPA entity. Fields: id, accountId, amount, date, type, description, etc. Relationships: ManyToOne with Account.

- **Bill.java**: 
JPA entity. Fields: id, userId, payee, amount, dueDate, status, autoPay, etc. Relationships: ManyToOne with User.

- **Budget.java**: 
JPA entity. Fields: id, userId, category, limit, spent, etc. Relationships: ManyToOne with User.

- **Transfer.java**: 
JPA entity. Fields: id, fromAccountId, toAccountId, amount, date, status, etc. Relationships: ManyToOne with Account.

## 5. dto/

- **UserRequestDTO.java**: 
Fields for registration/login (name, email, password, 2FA code, etc.). Used as input in UserController/AuthController.

- **UserResponseDTO.java**: 
Fields for user profile (id, name, email, etc.). Used as output in UserController.

- **AccountRequestDTO.java**: 
Fields for account creation/update (type, initial balance, etc.). Used as input in AccountController.

- **AccountResponseDTO.java**: 
Fields for account details (id, type, balance, etc.). Used as output in AccountController.

- **TransactionRequestDTO.java**: 
Fields for transaction creation/filter (amount, type, date, etc.). Used as input in TransactionController.

- **TransactionResponseDTO.java**: 
Fields for transaction details (id, amount, date, type, description, etc.). Used as output in TransactionController.

- **BillRequestDTO.java**: 
Fields for bill/payee creation/update (payee, amount, dueDate, etc.). Used as input in BillController.

- **BillResponseDTO.java**: 
Fields for bill/payee details (id, payee, amount, dueDate, status, etc.). Used as output in BillController.

- **BudgetRequestDTO.java**: 
Fields for budget creation/update (category, limit, etc.). Used as input in BudgetController.

- **BudgetResponseDTO.java**: 
Fields for budget details/progress (id, category, limit, spent, etc.). Used as output in BudgetController.

- **TransferRequestDTO.java**: 
Fields for transfer initiation (fromAccountId, toAccountId, amount, etc.). Used as input in TransferController.

- **TransferResponseDTO.java**: 
Fields for transfer details (id, fromAccountId, toAccountId, amount, date, status, etc.). Used as output in TransferController.

## 6. mapper/

- **UserMapper.java**: Converts between User entity and UserRequestDTO/UserResponseDTO. Used in UserService and UserController.

- **AccountMapper.java**: Converts between Account entity and AccountRequestDTO/AccountResponseDTO. Used in AccountService and AccountController.

- **TransactionMapper.java**: Converts between Transaction entity and TransactionRequestDTO/TransactionResponseDTO. Used in TransactionService and TransactionController.

- **BillMapper.java**: Converts between Bill entity and BillRequestDTO/BillResponseDTO. Used in BillService and BillController.

- **BudgetMapper.java**: Converts between Budget entity and BudgetRequestDTO/BudgetResponseDTO. Used in BudgetService and BudgetController.

- **TransferMapper.java**: Converts between Transfer entity and TransferRequestDTO/TransferResponseDTO. Used in TransferService and TransferController.

## 7. exception/

- **GlobalExceptionHandler.java**: Uses @ControllerAdvice to catch and handle exceptions thrown by controllers/services. Returns structured error responses (status, message, details).

- **ResourceNotFoundException.java**: Custom exception thrown when a requested resource (user, account, etc.) is not found. Handled by GlobalExceptionHandler.

- **UnauthorizedException.java**: Custom exception for unauthorized access attempts. Handled by GlobalExceptionHandler.

- **ValidationException.java**: Custom exception for input validation errors. Handled by GlobalExceptionHandler.

- **CustomBusinessException.java**: Custom exception for business rule violations (e.g., insufficient funds). Handled by GlobalExceptionHandler.

## 8. security/

- **SecurityConfig.java**: Configures Spring Security, JWT authentication, password encoding, endpoint protection, and CORS. Defines which endpoints are public/protected.

- **JwtTokenProvider.java**: Generates and validates JWT tokens. Used by AuthService and SecurityConfig.

- **JwtAuthenticationFilter.java**: Intercepts HTTP requests, extracts and validates JWT, sets authentication context. Used by SecurityConfig.

- **CustomUserDetailsService.java**: Loads user details from the database for authentication. Used by SecurityConfig.

- **AuthEntryPointJwt.java**: Handles unauthorized access attempts, returns 401 responses.

## 9. config/

- **SwaggerConfig.java**: Configures Swagger/OpenAPI for API documentation. Sets up API info, security, and endpoint grouping.

- **CorsConfig.java**: Configures CORS to allow requests from the frontend domain. Used by SecurityConfig.

- **AppConfig.java**: Defines general application-wide beans and configuration.
- **OpenAIConfig.java**: Configures Spring AI/OpenAI integration (API key, client setup, etc.).

## 10. util/

- **DateUtils.java**: Provides static methods for date/time parsing, formatting, and calculations (e.g., for filtering transactions).

- **ValidationUtils.java**: Provides static methods for custom input validation (e.g., email format, password strength).

- **EmailUtils.java**: Provides methods for sending emails (e.g., for 2FA, notifications).
- **FileExportUtils.java**: Provides methods for exporting data to CSV or PDF (e.g., transaction exports).

## 11. test/

- **UserServiceTest.java**: Unit tests for UserService methods (registration, login, profile update, etc.).

- **AccountControllerTest.java**: Unit and integration tests for AccountController endpoints (list, details, create, etc.).

- **TransactionServiceTest.java**: Unit tests for TransactionService methods (create, filter, export, etc.).

- **BillServiceTest.java**: Unit tests for BillService methods (CRUD, pay, history).
- **BudgetServiceTest.java**: Unit tests for BudgetService methods (CRUD, alerts, progress).

- **TransferServiceTest.java**: Unit tests for TransferService methods (initiate, validate, record transfer).
- **AuthServiceTest.java**: Unit tests for AuthService methods (login, JWT, 2FA verification).
