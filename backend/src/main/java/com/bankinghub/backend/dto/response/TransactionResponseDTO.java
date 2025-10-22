package com.bankinghub.backend.dto.response;

import com.bankinghub.backend.model.Transaction.TransactionStatus;
import com.bankinghub.backend.model.Transaction.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionResponseDTO {
    private Long id;
    private BigDecimal amount;
    private TransactionType type;
    private String description;
    private String category;
    private String merchant;
    private String referenceNumber;
    private TransactionStatus status;
    private BigDecimal balanceAfter;
    private LocalDateTime transactionDate;
    private LocalDateTime createdAt;
    private Long accountId;
    private String accountName;
}