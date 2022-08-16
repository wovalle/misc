package im.willy.butler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.google.api.client.util.Objects;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class ButlerApplication {
    public static void main(String[] args) {
        var environment = System.getenv("app.environment");

        System.out.println("ButlerApplication.main");
        System.out.println("Environment: " + environment);

        if (!Objects.equal(environment, "production")) {
            Dotenv.configure().systemProperties().load();
        }

        SpringApplication.run(ButlerApplication.class, args);
    }
}
