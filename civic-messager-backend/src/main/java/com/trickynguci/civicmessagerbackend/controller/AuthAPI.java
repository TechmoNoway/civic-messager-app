package com.trickynguci.civicmessagerbackend.controller;

import com.trickynguci.civicmessagerbackend.config.TokenGenerator;
import com.trickynguci.civicmessagerbackend.dto.LoginDTO;
import com.trickynguci.civicmessagerbackend.dto.SignupDTO;
import com.trickynguci.civicmessagerbackend.dto.TokenDTO;
import com.trickynguci.civicmessagerbackend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthAPI {

    private final UserDetailsManager userDetailsManager;

    private final TokenGenerator tokenGenerator;

    private final DaoAuthenticationProvider daoAuthenticationProvider;

    @Qualifier("jwtRefreshTokenAuthProvider")
    private final JwtAuthenticationProvider refreshTokenAuthProvider;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignupDTO signupDTO) {
        User user = User.builder()
                .username(signupDTO.getUsername())
                .password(signupDTO.getPassword())
                .build();
        userDetailsManager.createUser(user);

        Authentication authentication = UsernamePasswordAuthenticationToken.authenticated(user, signupDTO.getPassword(), Collections.emptyList());

        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = daoAuthenticationProvider.authenticate(UsernamePasswordAuthenticationToken.unauthenticated(loginDTO.getUsername(), loginDTO.getPassword()));

        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

    @PostMapping("/token")
    public ResponseEntity<?> token(@RequestBody TokenDTO tokenDTO) {
        Authentication authentication = refreshTokenAuthProvider.authenticate(new BearerTokenAuthenticationToken(tokenDTO.getRefreshToken()));

        return ResponseEntity.ok(tokenGenerator.createToken(authentication));
    }

}
