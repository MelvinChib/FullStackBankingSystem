package com.bankinghub.backend.repository;

import com.bankinghub.backend.model.Transfer;
import com.bankinghub.backend.model.Transfer.TransferStatus;
import com.bankinghub.backend.model.Transfer.TransferType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {

    @Query("SELECT t FROM Transfer t WHERE t.fromAccount.user.id = :userId OR t.toAccount.user.id = :userId ORDER BY t.scheduledDate DESC")
    Page<Transfer> findByUserIdOrderByScheduledDateDesc(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT t FROM Transfer t WHERE t.fromAccount.id = :accountId OR t.toAccount.id = :accountId ORDER BY t.scheduledDate DESC")
    List<Transfer> findByAccountIdOrderByScheduledDateDesc(@Param("accountId") Long accountId);

    @Query("SELECT t FROM Transfer t WHERE (t.fromAccount.user.id = :userId OR t.toAccount.user.id = :userId) AND t.status = :status ORDER BY t.scheduledDate DESC")
    List<Transfer> findByUserIdAndStatusOrderByScheduledDateDesc(@Param("userId") Long userId, @Param("status") TransferStatus status);

    @Query("SELECT t FROM Transfer t WHERE t.scheduledDate <= :currentDateTime AND t.status = :status")
    List<Transfer> findTransfersToProcess(@Param("currentDateTime") LocalDateTime currentDateTime, @Param("status") TransferStatus status);

    @Query("SELECT t FROM Transfer t WHERE (t.fromAccount.user.id = :userId OR t.toAccount.user.id = :userId) AND t.transferType = :transferType ORDER BY t.scheduledDate DESC")
    List<Transfer> findByUserIdAndTransferTypeOrderByScheduledDateDesc(@Param("userId") Long userId, @Param("transferType") TransferType transferType);

    @Query("SELECT t FROM Transfer t WHERE (t.fromAccount.user.id = :userId OR t.toAccount.user.id = :userId) AND t.scheduledDate BETWEEN :startDate AND :endDate ORDER BY t.scheduledDate DESC")
    List<Transfer> findByUserIdAndScheduledDateBetweenOrderByScheduledDateDesc(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(t) FROM Transfer t WHERE (t.fromAccount.user.id = :userId OR t.toAccount.user.id = :userId)")
    long countByUserId(@Param("userId") Long userId);

    List<Transfer> findTop10ByFromAccountUserIdOrToAccountUserIdOrderByScheduledDateDesc(Long fromUserId, Long toUserId);

    Optional<Transfer> findByReferenceNumber(String referenceNumber);
}