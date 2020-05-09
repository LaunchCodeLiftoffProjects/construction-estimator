package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.User;
import org.launchcode.constructionestimator.models.HomeDetails;
import org.launchcode.constructionestimator.models.data.UserDetailsRepository;
import org.launchcode.constructionestimator.models.data.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserDetailsRepository userDetailsRepository;

    @GetMapping("/{userId}")
    public ResponseEntity getUserById(@PathVariable("userId") int id) {

        if(userRepository.findById(id).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity(userRepository.findById(id).get(), HttpStatus.OK);
        }

    }

    @PostMapping
    public ResponseEntity postUser(@RequestBody User user) {

        userRepository.save(user);

        Integer id = user.getId();
        Map<String, String> map = Collections.singletonMap("id", id.toString());
        return new ResponseEntity(map, HttpStatus.CREATED);
    }

    @PutMapping("/{userId}")
    public ResponseEntity updateUser(@RequestBody User user, @PathVariable("userId") int id) {

        if(userRepository.findById(id).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            userRepository.save(user);
            return new ResponseEntity(HttpStatus.OK);
        }
    }

    @PostMapping("/{userId}/details")
    public ResponseEntity postUserDetails(@PathVariable("userId") int id, @RequestBody HomeDetails homeDetails) {

        if(userRepository.findById(id).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            User user = userRepository.findById(id).get();

            user.setHomeDetails(homeDetails);
            homeDetails.setUser(user);
            userDetailsRepository.save(homeDetails);

            return new ResponseEntity(HttpStatus.OK);
        }
    }
}
