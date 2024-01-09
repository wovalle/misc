package im.willy.butler.Adapters.Telegram;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import im.willy.butler.Actions.ScheduleMessageAction;
import im.willy.butler.Adapters.DialogFlow.DialogFlowClient;
import im.willy.butler.Adapters.DialogFlow.DialogFlowIntentResultHandler;
import im.willy.butler.Exceptions.DialogFlowIntentMissingException;
import im.willy.butler.Services.ReminderService;
import im.willy.butler.Services.UserService;

@Component
public class TelegramMessagePassthroughHandler {
    @Autowired
    DialogFlowClient dialogFlowClient;

    @Autowired
    TelegramUtils telegramUtils;

    @Autowired
    ReminderService reminderService;

    @Autowired
    UserService userService;

    @Autowired
    DialogFlowIntentResultHandler intentResultHandler;

    public void Handle(Message message) throws TelegramApiException {
        var chatId = message.getChatId();
        var senderId = message.getFrom().getId().toString();

        try {
            var intentResult = this.dialogFlowClient
                    .analyzeIntentInText(chatId.toString(), message.getText());

            var actionResult = intentResultHandler.HandleButlerAction(intentResult);

            System.out.println(String.format("Butler Action: %s, Text: %s\n",
                    actionResult.getAction().name(),
                    actionResult.getText()));

            switch (actionResult.getAction()) {
                case PassthroughMessage: {
                    telegramUtils.replyChat(chatId, actionResult.getText());
                    break;
                }
                case ScheduleMessage: {
                    var scheduleAction = (ScheduleMessageAction) actionResult;
                    var user = userService.findUserByAdapterId(senderId);

                    reminderService.saveReminder(user, scheduleAction.getReminderText(),
                            scheduleAction.reminderDate());
                    telegramUtils.replyChat(chatId, scheduleAction.getText());
                    break;
                }
                default:
                    break;
            }
        } catch (DialogFlowIntentMissingException e) {
            telegramUtils.replyChat(chatId, "[Error] Unsupported intent: " + e.getIntentText());
            e.printStackTrace();
        } catch (IOException e) {
            telegramUtils.replyChat(chatId, "[Error] Error analyzing intent");
            e.printStackTrace();
        }
    }

}
