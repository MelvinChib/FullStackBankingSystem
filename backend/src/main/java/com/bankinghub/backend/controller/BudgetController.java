package com.bankinghub.backend.controller;

import com.bankinghub.backend.dto.request.BudgetRequestDTO;
import com.bankinghub.backend.dto.response.BudgetResponseDTO;
import com.bankinghub.backend.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/budgets")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Budget Management", description = "Budget tracking and management endpoints")
public class BudgetController {

    private final BudgetService budgetService;

    @Operation(summary = "Create new budget", description = "Create a new budget for expense tracking")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Budget created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input or budget already exists"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PostMapping
    public ResponseEntity<BudgetResponseDTO> createBudget(@Valid @RequestBody BudgetRequestDTO budgetRequest) {
        log.info("Budget creation request received for category: {}", budgetRequest.getCategory());
        BudgetResponseDTO budget = budgetService.createBudget(budgetRequest);
        return new ResponseEntity<>(budget, HttpStatus.CREATED);
    }

    @Operation(summary = "Get user budgets", description = "Get all active budgets for the authenticated user")
    @GetMapping
    public ResponseEntity<List<BudgetResponseDTO>> getUserBudgets() {
        List<BudgetResponseDTO> budgets = budgetService.getUserBudgets();
        return ResponseEntity.ok(budgets);
    }

    @Operation(summary = "Get budget by ID", description = "Get budget details by budget ID")
    @GetMapping("/{budgetId}")
    public ResponseEntity<BudgetResponseDTO> getBudgetById(@PathVariable Long budgetId) {
        BudgetResponseDTO budget = budgetService.getBudgetById(budgetId);
        return ResponseEntity.ok(budget);
    }

    @Operation(summary = "Update budget", description = "Update budget information")
    @PutMapping("/{budgetId}")
    public ResponseEntity<BudgetResponseDTO> updateBudget(
            @PathVariable Long budgetId,
            @Valid @RequestBody BudgetRequestDTO budgetRequest) {
        BudgetResponseDTO budget = budgetService.updateBudget(budgetId, budgetRequest);
        return ResponseEntity.ok(budget);
    }

    @Operation(summary = "Delete budget", description = "Deactivate a budget")
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<Void> deleteBudget(@PathVariable Long budgetId) {
        budgetService.deleteBudget(budgetId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get budget alerts", description = "Get budgets that are exceeding alert thresholds")
    @GetMapping("/alerts")
    public ResponseEntity<List<BudgetResponseDTO>> getBudgetAlerts() {
        List<BudgetResponseDTO> alertBudgets = budgetService.getBudgetsExceedingAlert();
        return ResponseEntity.ok(alertBudgets);
    }

    @Operation(summary = "Get over-budget items", description = "Get budgets that have exceeded their limits")
    @GetMapping("/over-budget")
    public ResponseEntity<List<BudgetResponseDTO>> getOverBudgets() {
        List<BudgetResponseDTO> overBudgets = budgetService.getOverBudgets();
        return ResponseEntity.ok(overBudgets);
    }
}