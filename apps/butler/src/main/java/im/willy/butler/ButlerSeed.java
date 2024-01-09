package im.willy.butler;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import im.willy.butler.Models.User;
import im.willy.butler.Repositories.UserRepository;

@Configuration
public class ButlerSeed {

    @Bean
    public CommandLineRunner SeedDb(UserRepository userRepository) {
        return args -> {
            var adapterId = "8294858";
            var user = userRepository.findUserByAdapterId(adapterId);

            if (user == null) {
                userRepository.save(new User("Willy", adapterId));
            }
        };
    }

}
