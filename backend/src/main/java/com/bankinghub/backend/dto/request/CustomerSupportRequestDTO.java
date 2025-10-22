package com.bankinghub.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CustomerSupportRequestDTO {

    @NotBlank(message = "Message is required")
    @Size(min = 5, max = 1000, message = "Message must be between 5 and 1000 characters")
    private String message;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    private String conversationId;
}