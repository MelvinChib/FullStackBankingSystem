package com.bankinghub.backend.dto.request;

import com.bankinghub.backend.model.Budget.BudgetPeriod;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BudgetRequestDTO {

    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 100, message = "Category must be between 2 and 100 characters")
    private String category;

    @NotNull(message = "Budget limit is required")
    @DecimalMin(value = "0.01", message = "Budget limit must be positive")
    @Digits(integer = 13, fraction = 2, message = "Budget limit must have at most 13 integer digits and 2 decimal places")
    private BigDecimal budgetLimit;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    @NotNull(message = "Budget period is required")
    private BudgetPeriod period;

    private Boolean alertEnabled = true;

    @DecimalMin(value = "0.0", message = "Alert threshold must be non-negative")
    @DecimalMax(value = "100.0", message = "Alert threshold must not exceed 100%")
    @Digits(integer = 3, fraction = 2, message = "Alert threshold must have at most 3 integer digits and 2 decimal places")
    private BigDecimal alertThreshold = new BigDecimal("80.00");

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private Boolean active = true;
}