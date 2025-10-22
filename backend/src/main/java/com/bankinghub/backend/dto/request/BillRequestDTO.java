package com.bankinghub.backend.dto.request;

import com.bankinghub.backend.model.Bill.BillStatus;
import com.bankinghub.backend.model.Bill.RecurrenceFrequency;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BillRequestDTO {

    @NotBlank(message = "Payee name is required")
    @Size(min = 2, max = 100, message = "Payee name must be between 2 and 100 characters")
    private String payeeName;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    @Digits(integer = 13, fraction = 2, message = "Amount must have at most 13 integer digits and 2 decimal places")
    private BigDecimal amount;

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date cannot be in the past")
    private LocalDate dueDate;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private Boolean recurring = false;

    private RecurrenceFrequency recurrenceFrequency;

    private Boolean autoPay = false;

    private Long autoPayAccountId;

    @Size(max = 100, message = "Payee account number must not exceed 100 characters")
    private String payeeAccountNumber;

    @Size(max = 255, message = "Payee address must not exceed 255 characters")
    private String payeeAddress;

    private BillStatus status = BillStatus.PENDING;
}