package org.launchcode.constructionestimator.controllers;


import org.launchcode.constructionestimator.models.ERole;
import org.launchcode.constructionestimator.models.Role;
import org.launchcode.constructionestimator.models.User;
import org.launchcode.constructionestimator.models.data.RoleRepository;
import org.launchcode.constructionestimator.models.data.UserRepository;
import org.launchcode.constructionestimator.payload.request.LoginRequest;
import org.launchcode.constructionestimator.payload.request.SignupRequest;
import org.launchcode.constructionestimator.payload.response.JwtResponse;
import org.launchcode.constructionestimator.payload.response.MessageResponse;
import org.launchcode.constructionestimator.security.jwt.JwtUtils;
import org.launchcode.constructionestimator.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static org.launchcode.constructionestimator.models.ERole.ROLE_ADMIN;
import static org.launchcode.constructionestimator.models.ERole.ROLE_USER;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity registerUser(@Valid @RequestBody SignupRequest signupRequest) {

        // check and see if user exists
        if (userRepository.findByName(signupRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: An account with that email already exists"));
        }

        User user = new User(signupRequest.getFirstName(), signupRequest.getLastName(),
                signupRequest.getEmail(), encoder.encode(signupRequest.getPassword()));

        Set<String> strRoles= signupRequest.getRole();
        Set<Role> roles = new HashSet<>();

        // workaround to ensure ROLE_USER exists in database
        if(roleRepository.findByName(ROLE_USER).isEmpty()) {
            Role userRole = new Role();
            userRole.setName(ROLE_USER);
            roleRepository.save(userRole);
            Role adminRole = new Role();
            adminRole.setName(ROLE_ADMIN);
            roleRepository.save(adminRole);
        }

        // Here we would check what role the newly registered user has and assign it accordingly. For right now, just
        // gives them the role user
        Role userRole = roleRepository.findByName(ROLE_USER).get();
        roles.add(userRole);

        user.setRoles(roles);
        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signupRequest.getEmail(), signupRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> jwtRoles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Returns jwt token after registration
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), jwtRoles));

    }

    @PostMapping("/login")
    public ResponseEntity loginUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        // pull UserDetails out of Authentication object
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> jwtRoles = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Returns jwt token after login
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), jwtRoles));
    }
}
