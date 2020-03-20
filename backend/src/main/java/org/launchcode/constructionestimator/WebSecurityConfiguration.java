package org.launchcode.constructionestimator;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    // necessary to prevent 403 errors. This is probably really bad practice for any real application
    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
    }

}
