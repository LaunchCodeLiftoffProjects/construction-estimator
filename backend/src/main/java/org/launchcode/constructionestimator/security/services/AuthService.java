package org.launchcode.constructionestimator.security.services;

import org.launchcode.constructionestimator.models.data.UserRepository;
import org.launchcode.constructionestimator.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    // Returns true if user id matches email in token
    public boolean doesUserMatch(int id, String token) {





        return false;
    }
}
