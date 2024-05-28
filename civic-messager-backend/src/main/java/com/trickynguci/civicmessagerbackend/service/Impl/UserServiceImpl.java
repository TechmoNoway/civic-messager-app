package com.trickynguci.civicmessagerbackend.service.Impl;

import com.trickynguci.civicmessagerbackend.model.User;
import com.trickynguci.civicmessagerbackend.repository.UserRepository;
import com.trickynguci.civicmessagerbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }
}
