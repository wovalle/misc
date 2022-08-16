package im.willy.butler.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import im.willy.butler.Adapters.Telegram.TelegramService;

@RestController
@RequestMapping("/api/v1/telegram")
public class TelegramController {

    @Autowired
    private TelegramService telegramService;

    public TelegramController(TelegramService telegramService) {
        this.telegramService = telegramService;
    }

    @PostMapping
    public void OnMessageReceived(@RequestBody Update update) {
        var message = update.getMessage();
        try {
            System.out.println(String.format("Got Telegram message\nFrom: %s (%s)\nMessage: %s\n",
                    message.getFrom().getFirstName(),
                    message.getFrom().getId(),
                    message.getText()));

            this.telegramService.OnUpdateReceived(update);
        } catch (TelegramApiException e) {
            System.err.println(e);
        }
    }

    @GetMapping
    public String Index() {
        return "telegram/api";
    }

}
