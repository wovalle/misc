package im.willy.butler.Adapters.Telegram;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import im.willy.butler.Adapters.Telegram.Commands.ITelegramCommandHandler;

@Service
public class TelegramService {

    @Autowired
    private List<ITelegramCommandHandler> commandHandlers;

    @Autowired
    private TelegramMessagePassthroughHandler passthroughHandler;

    private String ExtractCommand(Message message) {
        if (!message.isCommand()) {
            return null;
        }

        var firstEntityWithPossibleUser = message.getEntities();

        if (firstEntityWithPossibleUser.isEmpty()) {
            return null;
        }

        var firstEntity = firstEntityWithPossibleUser.get(0).getText().strip().split("@")[0];

        return firstEntity;
    }

    public void OnUpdateReceived(Update update) throws TelegramApiException {
        var commandText = this.ExtractCommand(update.getMessage());

        if (update.getMessage().isCommand()) {
            for (ITelegramCommandHandler commandHandler : this.commandHandlers) {
                if (commandHandler.getName().equals(commandText)) {
                    commandHandler.Handle(update.getMessage());
                    return;
                }
            }
        }

        this.passthroughHandler.Handle(update.getMessage());
    }
}
