package im.willy.butler.Adapters.Telegram;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

@Component
public class TelegramUtils {
    @Autowired
    private TelegramBot bot;

    public TelegramBot getBot() {
        return bot;
    }

    public void replyChat(Long chatId, String text) throws TelegramApiException {
        var messageToSend = SendMessage.builder()
                .chatId(chatId)
                .text(text)
                .build();

        this.bot.execute(messageToSend);
    }
}
