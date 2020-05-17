package org.launchcode.constructionestimator.security.services;

import org.launchcode.constructionestimator.models.User;
import org.launchcode.constructionestimator.models.data.UserRepository;
import org.launchcode.constructionestimator.payload.response.JwtResponse;
import org.launchcode.constructionestimator.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserAuthService {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    // Returns true if user id matches email in token
    public boolean doesUserMatch(int id, String headerAuth) {

        // ensure Authorization header is formatted correctly
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Barer ")) {
            String token = headerAuth.substring(6);

            // check if token is valid
            if(jwtUtils.validateJwtToken(token)) {

                // gets the user's email address from the token
                String useremail = jwtUtils.getUserNameFromJwtToken(token);

                Optional<User> userOptional = userRepository.findByName(useremail);

                // ensure the user exists
                if (userOptional.isPresent()) {
                    User theUser = userOptional.get();
                    return theUser.getId() == id;
                }
            }
        }

        return false;
    }

    // creates JwtResponse json containing user's login token
    public JwtResponse generateJwtResponse(Authentication authentication) {

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        // pull UserDetails out of Authentication object
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> jwtRoles = userDetails.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), jwtRoles);
    }

    public String getUserName(String headerAuth) {
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Barer ")) {
            String token = headerAuth.substring(6);
            return jwtUtils.getUserNameFromJwtToken(token);
        }
        return null;
    }
}
