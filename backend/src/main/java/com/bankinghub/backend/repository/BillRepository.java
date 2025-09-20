package com.bankinghub.backend.repository;

import com.bankinghub.backend.model.Bill;
import com.bankinghub.backend.model.Bill.BillStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByUserIdOrderByDueDateAsc(Long userId);

    Optional<Bill> findByIdAndUserId(Long id, Long userId);

    List<Bill> findByUserIdAndStatusOrderByDueDateAsc(Long userId, BillStatus status);

    @Query("SELECT b FROM Bill b WHERE b.user.id = :userId AND b.dueDate BETWEEN :startDate AND :endDate ORDER BY b.dueDate ASC")
    List<Bill> findByUserIdAndDueDateBetweenOrderByDueDateAsc(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Bill b WHERE b.user.id = :userId AND b.dueDate < :currentDate AND b.status = :status")
    List<Bill> findOverdueBills(@Param("userId") Long userId, @Param("currentDate") LocalDate currentDate, @Param("status") BillStatus status);

    @Query("SELECT b FROM Bill b WHERE b.autoPay = true AND b.dueDate <= :dueDate AND b.status = :status")
    List<Bill> findAutoPayBillsDueByDate(@Param("dueDate") LocalDate dueDate, @Param("status") BillStatus status);

    List<Bill> findByUserIdAndCategory(Long userId, String category);

    List<Bill> findByUserIdAndRecurringTrue(Long userId);

    @Query("SELECT COUNT(b) FROM Bill b WHERE b.user.id = :userId AND b.status = :status")
    long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") BillStatus status);

    @Query("SELECT b FROM Bill b WHERE b.dueDate = :tomorrow AND b.status = 'PENDING'")
    List<Bill> findBillsDueTomorrow(@Param("tomorrow") LocalDate tomorrow);
}