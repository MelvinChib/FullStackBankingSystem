package com.bankinghub.backend.repository;

import com.bankinghub.backend.model.Transaction;
import com.bankinghub.backend.model.Transaction.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Page<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId, Pageable pageable);

    List<Transaction> findByAccountIdOrderByTransactionDateDesc(Long accountId);

    @Query("SELECT t FROM Transaction t WHERE t.account.user.id = :userId ORDER BY t.transactionDate DESC")
    Page<Transaction> findByUserIdOrderByTransactionDateDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId AND t.transactionDate BETWEEN :startDate AND :endDate ORDER BY t.transactionDate DESC")
    List<Transaction> findByAccountIdAndTransactionDateBetweenOrderByTransactionDateDesc(
            @Param("accountId") Long accountId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId AND t.type = :type ORDER BY t.transactionDate DESC")
    List<Transaction> findByAccountIdAndTypeOrderByTransactionDateDesc(
            @Param("accountId") Long accountId,
            @Param("type") TransactionType type);

    @Query("SELECT t FROM Transaction t WHERE t.account.id = :accountId AND t.category = :category ORDER BY t.transactionDate DESC")
    List<Transaction> findByAccountIdAndCategoryOrderByTransactionDateDesc(
            @Param("accountId") Long accountId,
            @Param("category") String category);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.account.user.id = :userId AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndTypeAndDateBetween(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.account.user.id = :userId AND t.category = :category AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndCategoryAndDateBetween(
            @Param("userId") Long userId,
            @Param("category") String category,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.account.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    List<Transaction> findTop10ByAccountIdOrderByTransactionDateDesc(Long accountId);
}