package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.User;
import org.launchcode.constructionestimator.models.HomeDetails;
import org.launchcode.constructionestimator.models.data.UserDetailsRepository;
import org.launchcode.constructionestimator.models.data.UserRepository;
import org.launchcode.constructionestimator.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserDetailsRepository userDetailsRepository;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity getUserById(@PathVariable("userId") int id, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        // ensure Authorization header is formatted correctly
        if(StringUtils.hasText(headerAuth) && headerAuth.startsWith("Barer ")) {
            // gets the user's email address from the token
            String useremail = jwtUtils.getUserNameFromJwtToken(headerAuth.substring(6));

            Optional<User> userOptional = userRepository.findByName(useremail);

            // ensure the user exists
            if(userOptional.isPresent()) {
                User theUser = userRepository.findByName(useremail).get();
                if(theUser.getId() != id) {
                    return new ResponseEntity(HttpStatus.UNAUTHORIZED);
                } else {
                    return new ResponseEntity(userRepository.findById(id).get(), HttpStatus.OK);
                }
            } else {
                return new ResponseEntity(HttpStatus.NOT_FOUND);
            }
        }

        return new ResponseEntity(HttpStatus.UNAUTHORIZED);
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
