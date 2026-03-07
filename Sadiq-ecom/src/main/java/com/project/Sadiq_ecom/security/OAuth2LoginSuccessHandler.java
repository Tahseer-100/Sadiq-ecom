package com.project.Sadiq_ecom.security;

import com.project.Sadiq_ecom.model.Role;
import com.project.Sadiq_ecom.model.User;
import com.project.Sadiq_ecom.repository.UserRepository;
import com.project.Sadiq_ecom.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");

        System.out.println("✅ Google login successful for email: " + email);

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(Role.USER);
            user.setProvider("GOOGLE");
            user.setProviderId(providerId);
            userRepository.save(user);
            System.out.println("✅ New user created: " + email);
        }

        // Generate JWT token
        String token = jwtService.generateToken(user);
        System.out.println("✅ JWT token generated");

        // Redirect with token
        response.sendRedirect("http://localhost:5173?token=" + token);
    }
}