package com.bankinghub.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transaction entity representing a financial transaction.
 * <p>
 * This entity stores transaction details including amount, type, status,
 * and associated account. Supports various transaction types such as
 * deposits, withdrawals, transfers, payments, and fees.
 * </p>
 * 
 * @author Melvin Musonda Chibanda
 * @version 2.0.0
 * @since 1.0.0
 */
@Entity
@Table(name = "transactions")
@Data
@EqualsAndHashCode(exclude = {"account"})
@ToString(exclude = {"account"})
@EntityListeners(AuditingEntityListener.class)
public class Transaction {

    /** Unique identifier for the transaction */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Transaction amount */
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    /** Type of transaction (DEPOSIT, WITHDRAWAL, TRANSFER, etc.) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    /** Description of the transaction */
    @Column(nullable = false, length = 255)
    private String description;

    /** Category of the transaction (e.g., Food, Transport, Utilities) */
    @Column(length = 100)
    private String category;

    /** Merchant or payee name */
    @Column(length = 100)
    private String merchant;

    /** Unique reference number for the transaction */
    @Column(length = 50)
    private String referenceNumber;

    /** Current status of the transaction */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.COMPLETED;

    /** Account balance after this transaction */
    @Column(precision = 15, scale = 2)
    private BigDecimal balanceAfter;

    /** Date and time when the transaction occurred */
    @Column(nullable = false)
    private LocalDateTime transactionDate;

    /** Timestamp when the transaction record was created */
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** Account associated with this transaction */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    /**
     * Transaction type enumeration.
     * <p>
     * Defines the different types of transactions supported by the system.
     * </p>
     */
    public enum TransactionType {
        /** Money deposited into account */
        DEPOSIT,
        /** Money withdrawn from account */
        WITHDRAWAL,
        /** Money received via transfer */
        TRANSFER_IN,
        /** Money sent via transfer */
        TRANSFER_OUT,
        /** Payment made to merchant or bill */
        PAYMENT,
        /** Refund received */
        REFUND,
        /** Bank fee charged */
        FEE,
        /** Interest earned or charged */
        INTEREST
    }

    /**
     * Transaction status enumeration.
     * <p>
     * Represents the current state of a transaction.
     * </p>
     */
    public enum TransactionStatus {
        /** Transaction is pending processing */
        PENDING,
        /** Transaction completed successfully */
        COMPLETED,
        /** Transaction failed */
        FAILED,
        /** Transaction was cancelled */
        CANCELLED
    }

    public TransactionType getTransactionType() { 
        return type; 
    }
    public BigDecimal getAmount() { 
        return amount; 
    }
    public String getDescription() { 
        return description; 
    }
    public LocalDateTime getCreatedAt() {
         return createdAt; 
    }
}