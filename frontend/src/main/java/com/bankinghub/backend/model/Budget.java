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
@Table(name = "budgets")
@Data
@EqualsAndHashCode(exclude = {"user"})
@ToString(exclude = {"user"})
@EntityListeners(AuditingEntityListener.class)
public class Budget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal budgetLimit;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal currentSpent = BigDecimal.ZERO;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetPeriod period = BudgetPeriod.MONTHLY;

    @Column(nullable = false)
    private Boolean alertEnabled = true;

    @Column(precision = 5, scale = 2)
    private BigDecimal alertThreshold = new BigDecimal("80.00"); // 80%

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private Boolean active = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum BudgetPeriod {
        WEEKLY, MONTHLY, QUARTERLY, YEARLY
    }

    public BigDecimal getRemainingBudget() {
        return budgetLimit.subtract(currentSpent);
    }

    public BigDecimal getSpentPercentage() {
        if (budgetLimit.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return currentSpent.divide(budgetLimit, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }

    public boolean isOverBudget() {
        return currentSpent.compareTo(budgetLimit) > 0;
    }

    public boolean shouldAlert() {
        return alertEnabled && getSpentPercentage().compareTo(alertThreshold) >= 0;
    }
}