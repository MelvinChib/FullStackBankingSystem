package com.bankinghub.backend.dto.request;

import com.bankinghub.backend.model.Account.AccountType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AccountRequestDTO {

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    @NotBlank(message = "Account name is required")
    @Size(min = 2, max = 100, message = "Account name must be between 2 and 100 characters")
    private String accountName;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = true, message = "Initial balance must be non-negative")
    @Digits(integer = 13, fraction = 2, message = "Initial balance must have at most 13 integer digits and 2 decimal places")
    private BigDecimal initialBalance = BigDecimal.ZERO;

    @DecimalMin(value = "0.0", inclusive = false, message = "Credit limit must be positive")
    @Digits(integer = 13, fraction = 2, message = "Credit limit must have at most 13 integer digits and 2 decimal places")
    private BigDecimal creditLimit;

    @DecimalMin(value = "0.0", inclusive = true, message = "Interest rate must be non-negative")
    @DecimalMax(value = "100.0", inclusive = true, message = "Interest rate must not exceed 100%")
    @Digits(integer = 3, fraction = 4, message = "Interest rate must have at most 3 integer digits and 4 decimal places")
    private BigDecimal interestRate;
}