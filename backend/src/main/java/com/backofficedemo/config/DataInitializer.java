package com.backofficedemo.config;

import com.backofficedemo.product.Product;
import com.backofficedemo.product.ProductRepository;
import com.backofficedemo.user.AppUser;
import com.backofficedemo.user.Role;
import com.backofficedemo.user.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Seeds demo data on startup when the database is empty. Idempotent.
 */
@Configuration
public class DataInitializer {

    private static final List<String> CATEGORIES =
            List.of("Electrónica", "Hogar", "Deporte", "Oficina", "Juguetería");

    @Bean
    CommandLineRunner seedData(UserRepository userRepository,
                               ProductRepository productRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            seedUsers(userRepository, passwordEncoder);
            seedProducts(productRepository);
        };
    }

    private void seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        if (userRepository.count() > 0) {
            return;
        }
        userRepository.save(AppUser.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .fullName("Administrador Demo")
                .role(Role.ADMIN)
                .build());
        userRepository.save(AppUser.builder()
                .username("viewer")
                .password(passwordEncoder.encode("viewer123"))
                .fullName("Usuario de solo lectura")
                .role(Role.VIEWER)
                .build());
    }

    private void seedProducts(ProductRepository productRepository) {
        if (productRepository.count() > 0) {
            return;
        }
        ThreadLocalRandom rnd = ThreadLocalRandom.current();
        for (int i = 1; i <= 48; i++) {
            String category = CATEGORIES.get(rnd.nextInt(CATEGORIES.size()));
            productRepository.save(Product.builder()
                    .sku("SKU-%04d".formatted(i))
                    .name(category + " artículo " + i)
                    .category(category)
                    .price(BigDecimal.valueOf(rnd.nextInt(500, 50_000) / 100.0))
                    .stock(rnd.nextInt(0, 200))
                    .active(rnd.nextInt(10) > 0) // ~90% active
                    .build());
        }
    }
}
