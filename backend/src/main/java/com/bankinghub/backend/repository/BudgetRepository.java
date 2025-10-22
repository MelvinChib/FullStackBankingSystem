package com.bankinghub.backend.repository;

import com.bankinghub.backend.model.Budget;
import com.bankinghub.backend.model.Budget.BudgetPeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByUserIdAndActiveTrue(Long userId);

    List<Budget> findByUserId(Long userId);

    Optional<Budget> findByIdAndUserId(Long id, Long userId);

    Optional<Budget> findByUserIdAndCategoryAndActiveTrue(Long userId, String category);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.startDate <= :currentDate AND b.endDate >= :currentDate AND b.active = true")
    List<Budget> findActiveBudgetsByUserIdAndDate(@Param("userId") Long userId, @Param("currentDate") LocalDate currentDate);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.period = :period AND b.active = true")
    List<Budget> findByUserIdAndPeriodAndActiveTrue(@Param("userId") Long userId, @Param("period") BudgetPeriod period);

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.category = :category AND b.startDate <= :currentDate AND b.endDate >= :currentDate AND b.active = true")
    Optional<Budget> findActiveBudgetByUserIdAndCategory(@Param("userId") Long userId, @Param("category") String category, @Param("currentDate") LocalDate currentDate);

    @Query("SELECT b FROM Budget b WHERE b.alertEnabled = true AND b.active = true AND (b.currentSpent / b.budgetLimit * 100) >= b.alertThreshold")
    List<Budget> findBudgetsExceedingAlertThreshold();

    @Query("SELECT b FROM Budget b WHERE b.user.id = :userId AND b.currentSpent > b.budgetLimit AND b.active = true")
    List<Budget> findOverBudgetsByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(b) FROM Budget b WHERE b.user.id = :userId AND b.active = true")
    long countActiveBudgetsByUserId(@Param("userId") Long userId);

    List<Budget> findByUserIdAndCategoryContainingIgnoreCase(Long userId, String category);
}