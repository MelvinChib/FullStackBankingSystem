package com.bankinghub.backend.dto.request;

import com.bankinghub.backend.model.Transfer.TransferType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransferRequestDTO {

    @NotNull(message = "From account ID is required")
    private Long fromAccountId;

    @NotNull(message = "To account ID is required")
    private Long toAccountId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    @Digits(integer = 13, fraction = 2, message = "Amount must have at most 13 integer digits and 2 decimal places")
    private BigDecimal amount;

    @NotBlank(message = "Description is required")
    @Size(min = 1, max = 255, message = "Description must be between 1 and 255 characters")
    private String description;

    @NotNull(message = "Transfer type is required")
    private TransferType transferType = TransferType.INTERNAL;

    private LocalDateTime scheduledDate;

    // External transfer fields (required for external transfers)
    @Size(max = 100, message = "External bank name must not exceed 100 characters")
    private String externalBankName;

    @Size(max = 50, message = "External account number must not exceed 50 characters")
    private String externalAccountNumber;

    @Size(max = 20, message = "External routing number must not exceed 20 characters")
    private String externalRoutingNumber;

    @Size(max = 100, message = "External account holder name must not exceed 100 characters")
    private String externalAccountHolderName;
}