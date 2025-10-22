package com.bankinghub.backend.service;

import com.bankinghub.backend.dto.request.BudgetRequestDTO;
import com.bankinghub.backend.dto.response.BudgetResponseDTO;
import com.bankinghub.backend.exception.CustomBusinessException;
import com.bankinghub.backend.exception.ResourceNotFoundException;
import com.bankinghub.backend.model.Budget;
import com.bankinghub.backend.model.User;
import com.bankinghub.backend.repository.BudgetRepository;
import com.bankinghub.backend.repository.TransactionRepository;
import com.bankinghub.backend.repository.UserRepository;
import com.bankinghub.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository = null;
    private final UserRepository userRepository = null;
    private final TransactionRepository transactionRepository = null;

    @Transactional
    public BudgetResponseDTO createBudget(BudgetRequestDTO budgetRequest) {
        User currentUser = getCurrentUser();
        log.info("Creating budget for user: {} in category: {}", currentUser.getEmail(), budgetRequest.getCategory());

        // Check if active budget already exists for this category
        if (budgetRepository.findByUserIdAndCategoryAndActiveTrue(currentUser.getId(), budgetRequest.getCategory()).isPresent()) {
            throw new CustomBusinessException("Active budget already exists for category: " + budgetRequest.getCategory());
        }

        Budget budget = new Budget();
        budget.setUser(currentUser);
        budget.setCategory(budgetRequest.getCategory());
        budget.setBudgetLimit(budgetRequest.getBudgetLimit());
        budget.setStartDate(budgetRequest.getStartDate());
        budget.setEndDate(budgetRequest.getEndDate());
        budget.setPeriod(budgetRequest.getPeriod());
        budget.setAlertEnabled(budgetRequest.getAlertEnabled());
        budget.setAlertThreshold(budgetRequest.getAlertThreshold());
        budget.setDescription(budgetRequest.getDescription());
        budget.setActive(budgetRequest.getActive());
        budget.setCurrentSpent(BigDecimal.ZERO);

        Budget savedBudget = budgetRepository.save(budget);
        
        // Calculate current spent amount from existing transactions
        updateBudgetSpentAmount(savedBudget);

        log.info("Budget created successfully for category: {}", savedBudget.getCategory());
        return convertToBudgetResponse(savedBudget);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getUserBudgets() {
        User currentUser = getCurrentUser();
        List<Budget> budgets = budgetRepository.findByUserIdAndActiveTrue(currentUser.getId());
        
        return budgets.stream()
                .map(this::convertToBudgetResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BudgetResponseDTO getBudgetById(Long budgetId) {
        User currentUser = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        return convertToBudgetResponse(budget);
    }

    @Transactional
    public BudgetResponseDTO updateBudget(Long budgetId, BudgetRequestDTO budgetRequest) {
        User currentUser = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        // Update fields
        budget.setCategory(budgetRequest.getCategory());
        budget.setBudgetLimit(budgetRequest.getBudgetLimit());
        budget.setStartDate(budgetRequest.getStartDate());
        budget.setEndDate(budgetRequest.getEndDate());
        budget.setPeriod(budgetRequest.getPeriod());
        budget.setAlertEnabled(budgetRequest.getAlertEnabled());
        budget.setAlertThreshold(budgetRequest.getAlertThreshold());
        budget.setDescription(budgetRequest.getDescription());
        budget.setActive(budgetRequest.getActive());

        Budget updatedBudget = budgetRepository.save(budget);
        
        // Recalculate spent amount
        updateBudgetSpentAmount(updatedBudget);

        log.info("Budget updated successfully: {}", updatedBudget.getCategory());
        return convertToBudgetResponse(updatedBudget);
    }

    @Transactional
    public void deleteBudget(Long budgetId) {
        User currentUser = getCurrentUser();
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + budgetId));

        budget.setActive(false);
        budgetRepository.save(budget);
        log.info("Budget deactivated successfully: {}", budget.getCategory());
    }

    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getBudgetsExceedingAlert() {
        List<Budget> alertBudgets = budgetRepository.findBudgetsExceedingAlertThreshold();
        
        return alertBudgets.stream()
                .map(this::convertToBudgetResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BudgetResponseDTO> getOverBudgets() {
        User currentUser = getCurrentUser();
        List<Budget> overBudgets = budgetRepository.findOverBudgetsByUserId(currentUser.getId());
        
        return overBudgets.stream()
                .map(this::convertToBudgetResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateBudgetSpentAmount(Budget budget) {
        LocalDateTime startDateTime = budget.getStartDate().atStartOfDay();
        LocalDateTime endDateTime = budget.getEndDate().atTime(23, 59, 59);

        BigDecimal totalSpent = transactionRepository.sumAmountByUserIdAndCategoryAndDateBetween(
                budget.getUser().getId(), 
                budget.getCategory(),
                startDateTime,
                endDateTime
        );

        budget.setCurrentSpent(totalSpent != null ? totalSpent : BigDecimal.ZERO);
        budgetRepository.save(budget);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private BudgetResponseDTO convertToBudgetResponse(Budget budget) {
        BudgetResponseDTO response = new BudgetResponseDTO();
        response.setId(budget.getId());
        response.setCategory(budget.getCategory());
        response.setBudgetLimit(budget.getBudgetLimit());
        response.setCurrentSpent(budget.getCurrentSpent());
        response.setStartDate(budget.getStartDate());
        response.setEndDate(budget.getEndDate());
        response.setPeriod(budget.getPeriod());
        response.setAlertEnabled(budget.getAlertEnabled());
        response.setAlertThreshold(budget.getAlertThreshold());
        response.setDescription(budget.getDescription());
        response.setActive(budget.getActive());
        response.setCreatedAt(budget.getCreatedAt());
        response.setUpdatedAt(budget.getUpdatedAt());
        
        // Set calculated fields
        response.setRemainingBudget(response.getRemainingBudget());
        response.setSpentPercentage(response.getSpentPercentage());
        response.setIsOverBudget(response.getIsOverBudget());
        response.setShouldAlert(response.getShouldAlert());
        response.setDaysRemaining(response.getDaysRemaining());
        response.setStatus(response.getStatus());
        
        return response;
    }
}