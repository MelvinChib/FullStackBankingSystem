package com.bankinghub.backend.service;

import com.bankinghub.backend.dto.request.CustomerSupportRequestDTO;
import com.bankinghub.backend.dto.response.CustomerSupportResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomerSupportService {

    // For demo purposes, using rule-based responses. In production, integrate with OpenAI API
    
    public CustomerSupportResponseDTO handleSupportRequest(CustomerSupportRequestDTO request) {
        log.info("Processing customer support request: {}", request.getMessage());
        
        String conversationId = request.getConversationId() != null ? 
            request.getConversationId() : UUID.randomUUID().toString();
            
        String response = generateResponse(request.getMessage(), request.getCategory());
        boolean requiresHumanAgent = requiresHumanIntervention(request.getMessage());
        
        CustomerSupportResponseDTO supportResponse = new CustomerSupportResponseDTO();
        supportResponse.setResponse(response);
        supportResponse.setConversationId(conversationId);
        supportResponse.setCategory(request.getCategory());
        supportResponse.setTimestamp(LocalDateTime.now());
        supportResponse.setRequiresHumanAgent(requiresHumanAgent);
        supportResponse.setSuggestedActions(generateSuggestedActions(request.getMessage()));
        
        return supportResponse;
    }
    
    private String generateResponse(String message, String category) {
        String lowerMessage = message.toLowerCase();
        
        // Account-related queries
        if (containsAny(lowerMessage, Arrays.asList("account", "balance", "statement", "login"))) {
            return "I can help you with your account! For account balance inquiries, please log into your MelvinBank Zambia mobile app or visit our website. If you're having trouble logging in, please verify your email and password. For detailed account statements, you can download them from the 'Statements' section in your dashboard.";
        }
        
        // Transaction-related queries
        if (containsAny(lowerMessage, Arrays.asList("transaction", "transfer", "payment", "send money"))) {
            return "For transaction assistance: You can transfer money between your accounts instantly through our app. For external transfers, please ensure you have the correct recipient details. Transaction history is available in your account dashboard. If you notice any unauthorized transactions, please contact us immediately.";
        }
        
        // Bill payment queries
        if (containsAny(lowerMessage, Arrays.asList("bill", "pay", "utilities", "electricity", "water"))) {
            return "MelvinBank Zambia makes bill payments easy! You can pay utilities, mobile money top-ups, and other bills directly through our app. Set up automatic payments to never miss a due date. We support all major Zambian utility companies and service providers.";
        }
        
        // Loan and credit queries
        if (containsAny(lowerMessage, Arrays.asList("loan", "credit", "borrow", "mortgage"))) {
            return "We offer competitive loan products including personal loans, business loans, and mortgages. Loan applications can be submitted online with instant pre-approval for qualified customers. Interest rates start from 12% per annum. Please visit our loans section in the app or speak with one of our loan officers.";
        }
        
        // Security concerns
        if (containsAny(lowerMessage, Arrays.asList("fraud", "security", "hack", "stolen", "suspicious"))) {
            return "Security is our top priority at MelvinBank Zambia. If you suspect fraudulent activity, please immediately: 1) Log into your account to review transactions, 2) Change your password, 3) Contact our fraud department at +260-XXX-XXXX. We have 24/7 fraud monitoring and will investigate any suspicious activity.";
        }
        
        // ATM and card queries
        if (containsAny(lowerMessage, Arrays.asList("atm", "card", "pin", "withdraw"))) {
            return "Our ATM network spans across Zambia for your convenience. Daily withdrawal limits apply based on your account type. If your card is lost or stolen, report it immediately through the app or call our hotline. PIN changes can be done at any MelvinBank ATM or through the mobile app.";
        }
        
        // General banking hours and contact
        if (containsAny(lowerMessage, Arrays.asList("hours", "open", "contact", "phone", "branch"))) {
            return "MelvinBank Zambia branches are open Monday-Friday 8:00 AM - 5:00 PM, Saturday 8:00 AM - 1:00 PM. Our digital services are available 24/7. Contact us: Phone: +260-XXX-XXXX, Email: support@melvinbank.zm. Find your nearest branch using our branch locator in the app.";
        }
        
        // Default response
        return "Thank you for contacting MelvinBank Zambia! I'm here to help you with your banking needs. Could you please provide more specific details about what you'd like assistance with? Our team is available 24/7 to support you with account management, transactions, loans, and general banking services.";
    }
    
    private boolean requiresHumanIntervention(String message) {
        String lowerMessage = message.toLowerCase();
        List<String> complexIssues = Arrays.asList(
            "complaint", "dispute", "error", "problem", "issue", 
            "wrong", "incorrect", "fraud", "unauthorized", "stolen",
            "appeal", "escalate", "manager", "supervisor"
        );
        
        return containsAny(lowerMessage, complexIssues);
    }
    
    private String generateSuggestedActions(String message) {
        String lowerMessage = message.toLowerCase();
        
        if (containsAny(lowerMessage, Arrays.asList("balance", "statement"))) {
            return "Check account balance in mobile app, Download statements, View transaction history";
        }
        
        if (containsAny(lowerMessage, Arrays.asList("transfer", "payment"))) {
            return "Use mobile app for transfers, Set up beneficiaries, Schedule future payments";
        }
        
        if (containsAny(lowerMessage, Arrays.asList("loan", "credit"))) {
            return "Apply for loan online, Check eligibility, Calculate EMI, Speak with loan officer";
        }
        
        return "Visit mobile app, Contact branch, Call customer service, Use online banking";
    }
    
    private boolean containsAny(String text, List<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }
}