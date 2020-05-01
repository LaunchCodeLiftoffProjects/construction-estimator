package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.User;
import org.launchcode.constructionestimator.models.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @PostMapping
    public ResponseEntity postUser(@RequestBody User user) {

        userRepository.save(user);

        Integer id = user.getId();
        Map<String, String> map = Collections.singletonMap("id", id.toString());
        return new ResponseEntity(map, HttpStatus.CREATED);
    }
}
