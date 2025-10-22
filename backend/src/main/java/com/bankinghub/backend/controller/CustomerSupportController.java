package com.bankinghub.backend.controller;

import com.bankinghub.backend.dto.request.CustomerSupportRequestDTO;
import com.bankinghub.backend.dto.response.CustomerSupportResponseDTO;
import com.bankinghub.backend.service.CustomerSupportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/customer-support")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Customer Support", description = "AI-powered customer support endpoints")
public class CustomerSupportController {

    private final CustomerSupportService customerSupportService;

    @Operation(summary = "Get AI support", description = "Get AI-powered customer support response")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Support response generated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    @PostMapping("/chat")
    public ResponseEntity<CustomerSupportResponseDTO> getSupportResponse(
            @Valid @RequestBody CustomerSupportRequestDTO request) {
        log.info("Customer support request received");
        
        CustomerSupportResponseDTO response = customerSupportService.handleSupportRequest(request);
        
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Get support categories", description = "Get available support categories")
    @GetMapping("/categories")
    public ResponseEntity<String[]> getSupportCategories() {
        String[] categories = {
            "Account Management",
            "Transactions & Transfers",
            "Bill Payments",
            "Loans & Credit",
            "Cards & ATM",
            "Security & Fraud",
            "Technical Support",
            "General Inquiry"
        };
        
        return ResponseEntity.ok(categories);
    }

    @Operation(summary = "Get quick help topics", description = "Get frequently asked questions")
    @GetMapping("/quick-help")
    public ResponseEntity<String[]> getQuickHelpTopics() {
        String[] topics = {
            "How to check account balance?",
            "How to transfer money?",
            "How to pay bills?",
            "What are the banking hours?",
            "How to reset my password?",
            "How to report a lost card?",
            "What are the loan rates?",
            "How to download statements?"
        };
        
        return ResponseEntity.ok(topics);
    }
}