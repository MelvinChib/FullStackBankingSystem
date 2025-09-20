package com.bankinghub.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerSupportResponseDTO {
    
    private String response;
    private String conversationId;
    private String category;
    private LocalDateTime timestamp;
    private Boolean requiresHumanAgent;
    private String suggestedActions;

    public CustomerSupportResponseDTO(String response, String conversationId) {
        this.response = response;
        this.conversationId = conversationId;
        this.timestamp = LocalDateTime.now();
        this.requiresHumanAgent = false;
    }
}