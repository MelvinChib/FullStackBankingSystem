package com.bankinghub.backend.dto.response;

import com.bankinghub.backend.model.Budget.BudgetPeriod;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class BudgetResponseDTO {
    private Long id;
    private String category;
    private BigDecimal budgetLimit;
    private BigDecimal currentSpent;
    private LocalDate startDate;
    private LocalDate endDate;
    private BudgetPeriod period;
    private Boolean alertEnabled;
    private BigDecimal alertThreshold;
    private String description;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Calculated fields
    private BigDecimal remainingBudget;
    private BigDecimal spentPercentage;
    private Boolean isOverBudget;
    private Boolean shouldAlert;
    private Long daysRemaining;
    private String status;

    public BigDecimal getRemainingBudget() {
        if (budgetLimit == null || currentSpent == null) return BigDecimal.ZERO;
        return budgetLimit.subtract(currentSpent);
    }

    public BigDecimal getSpentPercentage() {
        if (budgetLimit == null || currentSpent == null || budgetLimit.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return currentSpent.divide(budgetLimit, 4, java.math.RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }

    public Boolean getIsOverBudget() {
        if (budgetLimit == null || currentSpent == null) return false;
        return currentSpent.compareTo(budgetLimit) > 0;
    }

    public Boolean getShouldAlert() {
        if (alertEnabled == null || !alertEnabled || alertThreshold == null) return false;
        return getSpentPercentage().compareTo(alertThreshold) >= 0;
    }

    public Long getDaysRemaining() {
        if (endDate == null) return null;
        LocalDate now = LocalDate.now();
        if (now.isAfter(endDate)) return 0L;
        return Long.valueOf(now.until(endDate).getDays());
    }

    public String getStatus() {
        if (active == null || !active) return "Inactive";
        if (getIsOverBudget()) return "Over Budget";
        if (getShouldAlert()) return "Near Limit";
        return "On Track";
    }
}