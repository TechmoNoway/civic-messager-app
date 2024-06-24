package com.trickynguci.civicmessagerbackend.service;

import com.trickynguci.civicmessagerbackend.dto.UpdateUserDTO;
import com.trickynguci.civicmessagerbackend.dto.response.UserFriendsResponse;
import com.trickynguci.civicmessagerbackend.dto.response.UserResponse;
import com.trickynguci.civicmessagerbackend.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<UserResponse> getAllUsers();

    User getUserById(int id);

    boolean isUsernameExist(String username);

    int updateUser(UpdateUserDTO updateUserDTO);

    List<UserFriendsResponse> getAllUserFriendsAndLatestMessage(int userId);

}
