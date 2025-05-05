package com.vista.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpStatus;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final String jwtSecret = "u6Qw8Qw6QwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQwQw==";

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.endsWith("/auth/login");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        
        // If no Authorization header, reject the request
        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String token = header.substring(7);
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(jwtSecret)
                    .parseClaimsJws(token)
                    .getBody();
            
            String username = claims.getSubject();
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.emptyList());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.getWriter().write("Invalid token");
            }
        } catch (SignatureException e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Invalid token signature");
        } catch (Exception e) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Invalid token");
        }
    }
} 