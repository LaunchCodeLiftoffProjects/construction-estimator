package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.User;
import org.launchcode.constructionestimator.models.HomeDetails;
import org.launchcode.constructionestimator.models.data.UserDetailsRepository;
import org.launchcode.constructionestimator.models.data.UserRepository;
import org.launchcode.constructionestimator.security.services.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserDetailsRepository userDetailsRepository;

    @Autowired
    UserAuthService userAuthService;

    @Autowired
    PasswordEncoder encoder;

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getUserById(@PathVariable("userId") int id, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        if (userRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(id, headerAuth)) {
            return new ResponseEntity<>(userRepository.findById(id).get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateUser(@RequestBody User user, @PathVariable("userId") int id,
                                     @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        if (userRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(id, headerAuth)) {

            user.setPassword(encoder.encode(user.getPassword()));
            userRepository.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/{userId}/details")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> postUserDetails(@PathVariable("userId") int id, @RequestBody HomeDetails homeDetails,
                                          @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        if (userRepository.findById(id).isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(id, headerAuth)) {
            User user = userRepository.findById(id).get();

            user.setHomeDetails(homeDetails);
            homeDetails.setUser(user);
            userDetailsRepository.save(homeDetails);

            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
