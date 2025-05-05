package com.vista.backend.controller;

import com.vista.backend.dto.UserDto;
import com.vista.backend.entity.User;
import com.vista.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    @Autowired
    private UserService userService;
    
    @GetMapping
    public List<UserDto> getAllUsers() {
        logger.debug("Getting all users");
        List<UserDto> users = userService.getAllUsers().stream().map(this::toDto).collect(Collectors.toList());
        logger.debug("Found {} users", users.size());
        return users;
    }
    
    @PostMapping
    public UserDto createUser(@RequestBody UserDto userDto) {
        logger.debug("Creating new user: {}", userDto.getName());
        User savedUser = userService.createUser(toEntity(userDto));
        logger.debug("Created user with ID: {}", savedUser.getId());
        return toDto(savedUser);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        logger.debug("Getting user by ID: {}", id);
        return userService.getUserById(id)
                .map(user -> {
                    logger.debug("Found user: {}", user.getName());
                    return ResponseEntity.ok(toDto(user));
                })
                .orElseGet(() -> {
                    logger.debug("User not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    private User toEntity(UserDto dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        return user;
    }
} 