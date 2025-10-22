package com.bankinghub.backend.service;

import com.bankinghub.backend.dto.request.UserRegistrationRequestDTO;
import com.bankinghub.backend.dto.response.UserRegistrationResponseDTO;
import com.bankinghub.backend.model.Account;
import com.bankinghub.backend.model.User;
import com.bankinghub.backend.repository.AccountRepository;
import com.bankinghub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @Value("${app.bank.account.number-prefix}")
    private String accountNumberPrefix;
    
    @Value("${app.bank.account.initial-balance}")
    private BigDecimal initialBalance;

    private static final SecureRandom random = new SecureRandom();

    /**
     * Register a new user with automatic account creation
     */
    @Transactional
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO request) {
        log.info("Starting user registration process for email: {}", request.email());

        // Check if user already exists
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("User with email " + request.email() + " already exists");
        }

        try {
            // Create and save user
            User user = createUser(request);
            User savedUser = userRepository.save(user);
            log.info("User created successfully with ID: {}", savedUser.getId());

            // Create default account for user
            Account account = createDefaultAccount(savedUser);
            Account savedAccount = accountRepository.save(account);
            log.info("Default account created successfully: {}", savedAccount.getAccountNumber());

            // Send welcome email with account details
            emailService.sendWelcomeEmail(savedUser, savedAccount);
            log.info("Welcome email sent successfully to: {}", savedUser.getEmail());

            // Return response
            return UserRegistrationResponseDTO.builder()
                    .userId(savedUser.getId())
                    .email(savedUser.getEmail())
                    .firstName(savedUser.getFirstName())
                    .lastName(savedUser.getLastName())
                    .accountNumber(savedAccount.getAccountNumber())
                    .accountType(savedAccount.getAccountType().toString())
                    .message("Registration successful! Welcome email sent to " + savedUser.getEmail())
                    .registrationDate(savedUser.getCreatedAt())
                    .build();

        } catch (Exception e) {
            log.error("Error during user registration for email: {}", request.email(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    /**
     * Create additional account for existing user
     */
    @Transactional
    public Account createAdditionalAccount(Long userId, Account.AccountType accountType, String accountName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setAccountType(accountType);
        account.setAccountName(accountName != null ? accountName : getDefaultAccountName(accountType));
        account.setBalance(initialBalance);
        account.setUser(user);
        account.setActive(true);
        account.setDescription("Additional " + accountType.toString().toLowerCase().replace("_", " ") + " account");

        Account savedAccount = accountRepository.save(account);
        
        // Send account creation notification
        emailService.sendWelcomeEmail(user, savedAccount);
        
        log.info("Additional account created for user {}: {}", userId, savedAccount.getAccountNumber());
        return savedAccount;
    }

    private User createUser(UserRegistrationRequestDTO request) {
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(request.address());
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        user.setRole(User.Role.USER);
        user.setTwoFactorEnabled(false);
        
        return user;
    }

    private Account createDefaultAccount(User user) {
        Account account = new Account();
        account.setAccountNumber(generateUniqueAccountNumber());
        account.setAccountType(Account.AccountType.SAVINGS);
        account.setAccountName(getDefaultAccountName(account.getAccountType()));
        account.setBalance(initialBalance);
        account.setUser(user);
        account.setActive(true);
        account.setDescription("Primary " + account.getAccountType().toString().toLowerCase().replace("_", " ") + " account");
        
        // Set interest rate based on account type
        switch (account.getAccountType()) {
            case SAVINGS -> account.setInterestRate(new BigDecimal("0.025")); // 2.5%
            case CHECKING -> account.setInterestRate(new BigDecimal("0.005")); // 0.5%
            case INVESTMENT -> account.setInterestRate(new BigDecimal("0.045")); // 4.5%
            default -> account.setInterestRate(BigDecimal.ZERO);
        }
        
        return account;
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            // Generate 10-digit account number with prefix
            long number = 1000000000L + Math.abs(random.nextLong() % 9000000000L);
            accountNumber = accountNumberPrefix + number;
        } while (accountRepository.existsByAccountNumber(accountNumber));
        
        return accountNumber;
    }

    private String getDefaultAccountName(Account.AccountType accountType) {
        return switch (accountType) {
            case SAVINGS -> "My Savings Account";
            case CHECKING -> "My Checking Account";
            case CREDIT_CARD -> "My Credit Card";
            case LOAN -> "My Loan Account";
            case INVESTMENT -> "My Investment Account";
        };
    }

    /**
     * Check if email is available for registration
     */
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email.toLowerCase());
    }

    /**
     * Validate registration request
     */
    public void validateRegistrationRequest(UserRegistrationRequestDTO request) {
        if (request.email() == null || request.email().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        
        if (request.password() == null || request.password().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        
        if (request.firstName() == null || request.firstName().trim().isEmpty()) {
            throw new IllegalArgumentException("First name is required");
        }
        
        if (request.lastName() == null || request.lastName().trim().isEmpty()) {
            throw new IllegalArgumentException("Last name is required");
        }
        
        if (!isEmailAvailable(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }
    }
}