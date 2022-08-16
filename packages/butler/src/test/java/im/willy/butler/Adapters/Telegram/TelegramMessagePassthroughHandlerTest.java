package im.willy.butler.Adapters.Telegram;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.time.ZonedDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import im.willy.butler.Actions.PassthroughMessageAction;
import im.willy.butler.Actions.ScheduleMessageAction;
import im.willy.butler.Adapters.DialogFlow.DialogFlowClient;
import im.willy.butler.Adapters.DialogFlow.DialogFlowIntentResultHandler;
import im.willy.butler.Exceptions.DialogFlowIntentMissingException;
import im.willy.butler.Models.User;
import im.willy.butler.Services.ReminderService;
import im.willy.butler.Services.UserService;

@ExtendWith(MockitoExtension.class)
public class TelegramMessagePassthroughHandlerTest {
        @Mock
        private TelegramUtils telegramUtils;

        @Mock
        private DialogFlowClient dialogFlowClient;

        @Mock
        private UserService userService;

        @Mock
        private ReminderService reminderService;

        @Mock
        private DialogFlowIntentResultHandler intentResultHandler;

        @InjectMocks
        private TelegramMessagePassthroughHandler passthroughHandler;

        @Test
        void testHandle_WhenActionResultIsMessagePassthrough()
                        throws TelegramApiException, IOException, DialogFlowIntentMissingException {
                Message message = new MessageMockBuilder()
                                .mockChatId(1L)
                                .mockText("test")
                                .mockSenderId(99L)
                                .build();

                when(dialogFlowClient.analyzeIntentInText(anyString(), anyString()))
                                .thenReturn(null);

                when(intentResultHandler.HandleButlerAction(any()))
                                .thenReturn(new PassthroughMessageAction("passthrough reply text"));

                this.passthroughHandler.Handle(message);

                verify(telegramUtils).replyChat(1L, "passthrough reply text");
        }

        @Test
        void testHandle_WhenActionResultIsScheduleMessage()
                        throws TelegramApiException, IOException, DialogFlowIntentMissingException {
                var user = mock(User.class);
                var reminderDate = ZonedDateTime.now();
                var reminderText = "reminder text";

                Message message = new MessageMockBuilder()
                                .mockChatId(1L)
                                .mockText(reminderText)
                                .mockSenderId(99L)
                                .build();

                when(dialogFlowClient.analyzeIntentInText(anyString(), anyString()))
                                .thenReturn(null);

                when(intentResultHandler.HandleButlerAction(any()))
                                .thenReturn(new ScheduleMessageAction("reply fulfillment text", reminderText,
                                                reminderDate));

                doNothing().when(reminderService).saveReminder(any(User.class), anyString(), any(ZonedDateTime.class));
                when(userService.findUserByAdapterId("99")).thenReturn(user);

                this.passthroughHandler.Handle(message);

                verify(telegramUtils).replyChat(1L, "reply fulfillment text");
                verify(reminderService).saveReminder(user, reminderText, reminderDate);
        }

        @Test
        void testHandle_WhenAnalyzeIntentThrows()
                        throws TelegramApiException, IOException {
                Message message = new MessageMockBuilder()
                                .mockChatId(1L)
                                .mockText("test")
                                .mockSenderId(99L)
                                .build();

                when(dialogFlowClient.analyzeIntentInText(anyString(), anyString()))
                                .thenThrow(new IOException());

                this.passthroughHandler.Handle(message);

                verify(telegramUtils).replyChat(1L, "[Error] Error analyzing intent");
        }

        @Test
        void testHandle_WhenIntentIsUndefined()
                        throws TelegramApiException, IOException, DialogFlowIntentMissingException {
                Message message = new MessageMockBuilder()
                                .mockChatId(1L)
                                .mockText("test")
                                .mockSenderId(99L)
                                .build();

                when(dialogFlowClient.analyzeIntentInText(anyString(), anyString()))
                                .thenReturn(null);

                when(intentResultHandler.HandleButlerAction(any()))
                                .thenThrow(new DialogFlowIntentMissingException("mock"));

                this.passthroughHandler.Handle(message);

                verify(telegramUtils).replyChat(1L, "[Error] Unsupported intent: mock");
        }
}
