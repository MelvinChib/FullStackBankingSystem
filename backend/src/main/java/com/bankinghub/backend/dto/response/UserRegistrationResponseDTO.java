package com.bankinghub.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserRegistrationResponseDTO {
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String accountNumber;
    private String accountType;
    private String message;
    private LocalDateTime registrationDate;
}
