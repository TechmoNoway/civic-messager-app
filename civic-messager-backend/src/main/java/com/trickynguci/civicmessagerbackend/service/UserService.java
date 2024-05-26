package com.trickynguci.civicmessagerbackend.service;

import com.trickynguci.civicmessagerbackend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<User> getAllUsers();

    Optional<User> getUserById(int id);




}
