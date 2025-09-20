package com.bankinghub.backend.dto.response;

import com.bankinghub.backend.model.Account.AccountType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AccountResponseDTO {

    private Long id;
    private String accountNumber;
    private AccountType accountType;
    private BigDecimal balance;
    private String accountName;
    private String description;
    private Boolean active;
    private BigDecimal creditLimit;
    private BigDecimal interestRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Calculated fields
    private BigDecimal availableBalance;
    private String maskedAccountNumber;

    public String getMaskedAccountNumber() {
        if (accountNumber == null || accountNumber.length() < 4) {
            return accountNumber;
        }
        String lastFour = accountNumber.substring(accountNumber.length() - 4);
        return "****" + lastFour;
    }

    public BigDecimal getAvailableBalance() {
        if (accountType == AccountType.CREDIT_CARD && creditLimit != null) {
            return creditLimit.subtract(balance);
        }
        return balance;
    }
}