package im.willy.butler.Adapters.Telegram.Commands;

import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

public interface ITelegramCommandHandler {
    public String getName();

    public void Handle(Message message) throws TelegramApiException;
}
