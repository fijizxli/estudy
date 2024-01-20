package com.estudy.estudybackend;

import com.estudy.estudybackend.services.UserDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    UserDetailServiceImpl userDetailsService;


    private final AuthenticationProvider authenticationProvider;

    public SecurityConfig(UserDetailServiceImpl userDetailsService, AuthenticationProvider authenticationProvider) {
        this.userDetailsService = userDetailsService;
        this.authenticationProvider = authenticationProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and()
        .authorizeRequests()
            .anyRequest().permitAll().and()
            .userDetailsService(userDetailsService);

            //http.addFilterBefore(corsFilter());
        http.addFilterBefore(new ApiKeyFilter(), UsernamePasswordAuthenticationFilter.class);

        http.authenticationProvider(authenticationProvider);
        http.httpBasic();
        http.csrf().disable();
        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow all origins, methods, and headers for development purposes
        config.addAllowedOrigin("*");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}
