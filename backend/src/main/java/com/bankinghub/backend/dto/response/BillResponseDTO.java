package com.bankinghub.backend.dto.response;

import com.bankinghub.backend.model.Bill.BillStatus;
import com.bankinghub.backend.model.Bill.RecurrenceFrequency;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BillResponseDTO {
    private Long id;
    private String payeeName;
    private BigDecimal amount;
    private LocalDate dueDate;
    private BillStatus status;
    private String category;
    private String description;
    private Boolean recurring;
    private RecurrenceFrequency recurrenceFrequency;
    private Boolean autoPay;
    private Long autoPayAccountId;
    private LocalDate lastPaidDate;
    private LocalDate nextDueDate;
    private String payeeAccountNumber;
    private String payeeAddress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getDaysUntilDue() {
        if (dueDate == null) return null;
        return Long.valueOf(LocalDate.now().until(dueDate).getDays());
    }

    public Boolean getIsOverdue() {
        return dueDate != null && dueDate.isBefore(LocalDate.now()) && status == BillStatus.PENDING;
    }
}