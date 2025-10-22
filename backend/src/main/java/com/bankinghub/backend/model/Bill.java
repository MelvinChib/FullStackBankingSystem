package com.bankinghub.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bills")
@Data
@EqualsAndHashCode(exclude = {"user"})
@ToString(exclude = {"user"})
@EntityListeners(AuditingEntityListener.class)
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String payeeName;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillStatus status = BillStatus.PENDING;

    @Column(length = 100)
    private String category;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private Boolean recurring = false;

    @Enumerated(EnumType.STRING)
    private RecurrenceFrequency recurrenceFrequency;

    @Column(nullable = false)
    private Boolean autoPay = false;

    @Column(name = "auto_pay_account_id")
    private Long autoPayAccountId;

    private LocalDate lastPaidDate;

    private LocalDate nextDueDate;

    @Column(length = 100)
    private String payeeAccountNumber;

    @Column(length = 255)
    private String payeeAddress;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum BillStatus {
        PENDING, PAID, OVERDUE, CANCELLED, SCHEDULED
    }

    public enum RecurrenceFrequency {
        WEEKLY, MONTHLY, QUARTERLY, ANNUALLY
    }
}