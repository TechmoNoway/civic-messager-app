package com.trickynguci.civicmessagerbackend.repository;

import com.trickynguci.civicmessagerbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    List<User> findAll();

    User findById(int id);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

}
