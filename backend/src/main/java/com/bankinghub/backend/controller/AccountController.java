package com.bankinghub.backend.controller;

import com.bankinghub.backend.dto.request.AccountRequestDTO;
import com.bankinghub.backend.dto.response.AccountResponseDTO;
import com.bankinghub.backend.dto.response.TransactionResponseDTO;
import com.bankinghub.backend.service.AccountService;
import com.bankinghub.backend.service.StatementExportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/accounts")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Account Management", description = "Account management and statement export endpoints")
public class AccountController {

    private final AccountService accountService;
    private final StatementExportService statementExportService;

    @Operation(summary = "Create new account", description = "Create a new bank account for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Account created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PostMapping
    public ResponseEntity<AccountResponseDTO> createAccount(@Valid @RequestBody AccountRequestDTO accountRequest) {
        log.info("Account creation request received");
        AccountResponseDTO account = accountService.createAccount(accountRequest);
        return new ResponseEntity<>(account, HttpStatus.CREATED);
    }

    @Operation(summary = "Get user accounts", description = "Get all active accounts for the authenticated user")
    @GetMapping
    public ResponseEntity<List<AccountResponseDTO>> getUserAccounts() {
        List<AccountResponseDTO> accounts = accountService.getUserAccounts();
        return ResponseEntity.ok(accounts);
    }

    @Operation(summary = "Get account by ID", description = "Get account details by account ID")
    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponseDTO> getAccountById(@PathVariable Long accountId) {
        AccountResponseDTO account = accountService.getAccountById(accountId);
        return ResponseEntity.ok(account);
    }

    @Operation(summary = "Update account", description = "Update account information")
    @PutMapping("/{accountId}")
    public ResponseEntity<AccountResponseDTO> updateAccount(
            @PathVariable Long accountId,
            @Valid @RequestBody AccountRequestDTO accountRequest) {
        AccountResponseDTO account = accountService.updateAccount(accountId, accountRequest);
        return ResponseEntity.ok(account);
    }

    @Operation(summary = "Delete account", description = "Deactivate an account (account must have zero balance)")
    @DeleteMapping("/{accountId}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long accountId) {
        accountService.deleteAccount(accountId);
        return ResponseEntity.noContent().build();
    }

    // Statement Export Endpoints
    @Operation(summary = "Export statement to PDF", description = "Generate and download account statement in PDF format")
    @GetMapping("/{accountId}/statement/pdf")
    public ResponseEntity<byte[]> exportStatementToPDF(
            @PathVariable Long accountId,
            @Parameter(description = "Start date for statement period")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @Parameter(description = "End date for statement period")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        
        log.info("PDF statement export requested for account: {}", accountId);
        
        AccountResponseDTO account = accountService.getAccountById(accountId);
        List<TransactionResponseDTO> transactions = getTransactionsForPeriod(accountId, fromDate, toDate);
        
        byte[] pdfContent = statementExportService.exportToPDF(account, transactions, fromDate, toDate);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", 
            "statement_" + account.getMaskedAccountNumber() + "_" + System.currentTimeMillis() + ".pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfContent);
    }

    @Operation(summary = "Export statement to CSV", description = "Generate and download account statement in CSV format")
    @GetMapping("/{accountId}/statement/csv")
    public ResponseEntity<String> exportStatementToCSV(
            @PathVariable Long accountId,
            @Parameter(description = "Start date for statement period")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @Parameter(description = "End date for statement period")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        
        log.info("CSV statement export requested for account: {}", accountId);
        
        AccountResponseDTO account = accountService.getAccountById(accountId);
        List<TransactionResponseDTO> transactions = getTransactionsForPeriod(accountId, fromDate, toDate);
        
        String csvContent = statementExportService.exportToCSV(account, transactions, fromDate, toDate);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", 
            "statement_" + account.getMaskedAccountNumber() + "_" + System.currentTimeMillis() + ".csv");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(csvContent);
    }

    @Operation(summary = "Export statement to Text", description = "Generate and download account statement in Text format")
    @GetMapping("/{accountId}/statement/text")
    public ResponseEntity<String> exportStatementToText(
            @PathVariable Long accountId,
            @Parameter(description = "Start date for statement period")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fromDate,
            @Parameter(description = "End date for statement period")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime toDate) {
        
        log.info("Text statement export requested for account: {}", accountId);
        
        AccountResponseDTO account = accountService.getAccountById(accountId);
        List<TransactionResponseDTO> transactions = getTransactionsForPeriod(accountId, fromDate, toDate);
        
        String textContent = statementExportService.exportToText(account, transactions, fromDate, toDate);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", 
            "statement_" + account.getMaskedAccountNumber() + "_" + System.currentTimeMillis() + ".txt");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(textContent);
    }

    // Helper method - In a real application, this would be implemented in TransactionService
    private List<TransactionResponseDTO> getTransactionsForPeriod(Long accountId, LocalDateTime fromDate, LocalDateTime toDate) {
        // For demo purposes, return empty list. 
        // In production, implement TransactionService.getTransactionsByAccountAndPeriod()
        log.info("Getting transactions for account {} from {} to {}", accountId, fromDate, toDate);
        return new ArrayList<>();
    }
}