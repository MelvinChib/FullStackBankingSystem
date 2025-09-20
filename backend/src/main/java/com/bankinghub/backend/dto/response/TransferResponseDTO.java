package com.bankinghub.backend.dto.response;

import com.bankinghub.backend.model.Transfer.TransferStatus;
import com.bankinghub.backend.model.Transfer.TransferType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransferResponseDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private TransferStatus status;
    private TransferType transferType;
    private String referenceNumber;
    private BigDecimal transferFee;
    private LocalDateTime scheduledDate;
    private LocalDateTime processedDate;
    private String failureReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Account information
    private Long fromAccountId;
    private String fromAccountName;
    private String fromAccountNumber;
    private Long toAccountId;
    private String toAccountName;
    private String toAccountNumber;
    
    // External transfer details
    private String externalBankName;
    private String externalAccountNumber;
    private String externalRoutingNumber;
    private String externalAccountHolderName;
    
    // Calculated fields
    private String statusDescription;
    private Boolean canCancel;
    private Long hoursUntilProcessing;

    public String getStatusDescription() {
        if (status == null) return "Unknown";
        
        switch (status) {
            case PENDING:
                return "Transfer is pending approval";
            case PROCESSING:
                return "Transfer is being processed";
            case COMPLETED:
                return "Transfer completed successfully";
            case FAILED:
                return "Transfer failed" + (failureReason != null ? ": " + failureReason : "");
            case CANCELLED:
                return "Transfer was cancelled";
            default:
                return status.toString();
        }
    }

    public Boolean getCanCancel() {
        return status == TransferStatus.PENDING && 
               (scheduledDate == null || scheduledDate.isAfter(LocalDateTime.now()));
    }

    public Long getHoursUntilProcessing() {
        if (scheduledDate == null || scheduledDate.isBefore(LocalDateTime.now())) {
            return 0L;
        }
        return java.time.Duration.between(LocalDateTime.now(), scheduledDate).toHours();
    }
}