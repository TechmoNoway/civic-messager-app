package com.trickynguci.civicmessagerbackend.controller;

import com.trickynguci.civicmessagerbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserAPI {


    private final UserService userService;


    @GetMapping("/getAllUsers")
    public ResponseEntity<?> doGetAllUsers() {
        HashMap<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("message", "Call api getAllUsers successfully");
            result.put("data", userService.getAllUsers());
            return ResponseEntity.status(HttpStatus.OK).body(result);

        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Call api getAllUsers failed");
            result.put("data", null);
            log.error("error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    @GetMapping("/getUserById")
    public ResponseEntity<?> doGetUserById(@RequestParam("id") int id) {
        HashMap<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("message", "Call api getAllUsers successfully");
            result.put("data", userService.getUserById(id));
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "Call api getAllUsers failed");
            result.put("data", null);
            log.error("error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }


    }




}
