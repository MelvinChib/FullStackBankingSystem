package com.bankinghub.backend.service;

import com.bankinghub.backend.dto.request.LoginRequestDTO;
import com.bankinghub.backend.dto.request.UserRequestDTO;
import com.bankinghub.backend.dto.response.JwtResponseDTO;
import com.bankinghub.backend.dto.response.UserResponseDTO;
import com.bankinghub.backend.exception.CustomBusinessException;
import com.bankinghub.backend.exception.ResourceNotFoundException;
import com.bankinghub.backend.model.User;
import com.bankinghub.backend.repository.UserRepository;
import com.bankinghub.backend.security.JwtTokenProvider;
import com.bankinghub.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public UserResponseDTO registerUser(UserRequestDTO userRequest) {
        log.info("Attempting to register user with email: {}", userRequest.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new CustomBusinessException("Email is already registered!");
        }

        // Create new user
        User user = new User();
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setPhoneNumber(userRequest.getPhoneNumber());
        user.setAddress(userRequest.getAddress());
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with email: {}", savedUser.getEmail());

        return convertToUserResponse(savedUser);
    }

    @Transactional
    public JwtResponseDTO authenticateUser(LoginRequestDTO loginRequest) {
        log.info("Attempting to authenticate user: {}", loginRequest.getEmail());

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(userPrincipal.getEmail(), userPrincipal.getId());

        User user = userRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserResponseDTO userResponse = convertToUserResponse(user);

        log.info("User authenticated successfully: {}", loginRequest.getEmail());

        return new JwtResponseDTO(jwt, tokenProvider.getExpirationTime(), userResponse);
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomBusinessException("No authenticated user found");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return convertToUserResponse(user);
    }

    private UserResponseDTO convertToUserResponse(User user) {
        UserResponseDTO userResponse = new UserResponseDTO();
        userResponse.setId(user.getId());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setEmail(user.getEmail());
        userResponse.setPhoneNumber(user.getPhoneNumber());
        userResponse.setAddress(user.getAddress());
        userResponse.setTwoFactorEnabled(user.getTwoFactorEnabled());
        userResponse.setEnabled(user.getEnabled());
        userResponse.setRole(user.getRole());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        return userResponse;
    }
}