package com.bankinghub.backend.repository;

import com.bankinghub.backend.model.Account;
import com.bankinghub.backend.model.Account.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    List<Account> findByUserIdAndActiveTrue(Long userId);

    List<Account> findByUserId(Long userId);

    Optional<Account> findByIdAndUserId(Long id, Long userId);

    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findByUserIdAndAccountType(Long userId, AccountType accountType);

    @Query("SELECT a FROM Account a WHERE a.user.id = :userId AND a.active = true ORDER BY a.createdAt DESC")
    List<Account> findActiveAccountsByUserIdOrderByCreatedAt(@Param("userId") Long userId);

    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.user.id = :userId AND a.active = true AND a.accountType IN :accountTypes")
    BigDecimal getTotalBalanceByUserIdAndAccountTypes(@Param("userId") Long userId, @Param("accountTypes") List<AccountType> accountTypes);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.user.id = :userId AND a.active = true")
    long countActiveAccountsByUserId(@Param("userId") Long userId);

    boolean existsByAccountNumber(String accountNumber);
}