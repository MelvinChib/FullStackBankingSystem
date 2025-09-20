package com.bankinghub.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresIn;
    private UserResponseDTO user;

    public JwtResponseDTO(String accessToken, Long expiresIn, UserResponseDTO user) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }
}