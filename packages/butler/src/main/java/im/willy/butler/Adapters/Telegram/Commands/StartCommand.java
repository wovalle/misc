package im.willy.butler.Adapters.Telegram.Commands;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import im.willy.butler.Adapters.Telegram.TelegramUtils;
import im.willy.butler.Services.UserService;

@Component
public class StartCommand implements ITelegramCommandHandler {

    @Autowired
    private TelegramUtils telegramUtils;

    @Autowired
    private UserService userService;

    public static String getResponse(String name) {
        return String.format("""
                Hi %s! I'm @wovalle's bot.

                What can I do?
                Remind me <something> on Jan 1st
                Remind me <something> in three hours
                Set a reminder for <something> today at 7pm
                """, name);
    }

    @Override
    public void Handle(Message message) throws TelegramApiException {
        var chatId = message.getChatId();
        var telegramId = message.getFrom().getId().toString();
        var name = message.getFrom().getFirstName();

        var user = userService.findOrInsertUserByAdapterId(telegramId, name);
        telegramUtils.replyChat(chatId, StartCommand.getResponse(user.getName()));
    }

    @Override
    public String getName() {
        return "/start";
    }
}
