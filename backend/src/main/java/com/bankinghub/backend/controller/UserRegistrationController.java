package com.bankinghub.backend.controller;

import com.bankinghub.backend.dto.request.UserRegistrationRequestDTO;
import com.bankinghub.backend.dto.response.UserRegistrationResponseDTO;
import com.bankinghub.backend.service.UserRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserRegistrationController {

    private final UserRegistrationService userRegistrationService;

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@Valid @RequestBody UserRegistrationRequestDTO request) {
        UserRegistrationResponseDTO response = userRegistrationService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
