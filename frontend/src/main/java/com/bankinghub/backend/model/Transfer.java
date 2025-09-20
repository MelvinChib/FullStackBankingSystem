package com.bankinghub.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transfers")
@Data
@EqualsAndHashCode(exclude = {"fromAccount", "toAccount"})
@ToString(exclude = {"fromAccount", "toAccount"})
@EntityListeners(AuditingEntityListener.class)
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransferStatus status = TransferStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransferType transferType = TransferType.INTERNAL;

    @Column(length = 50)
    private String referenceNumber;

    @Column(precision = 15, scale = 2)
    private BigDecimal transferFee = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDateTime scheduledDate;

    @Column
    private LocalDateTime processedDate;

    @Column(length = 255)
    private String failureReason;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_account_id", nullable = false)
    private Account fromAccount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_account_id", nullable = false)
    private Account toAccount;

    // External transfer fields
    @Column(length = 100)
    private String externalBankName;

    @Column(length = 50)
    private String externalAccountNumber;

    @Column(length = 20)
    private String externalRoutingNumber;

    @Column(length = 100)
    private String externalAccountHolderName;

    public enum TransferStatus {
        PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    }

    public enum TransferType {
        INTERNAL,     // Between user's own accounts
        EXTERNAL,     // To external bank account
        P2P          // Person to person
    }
}