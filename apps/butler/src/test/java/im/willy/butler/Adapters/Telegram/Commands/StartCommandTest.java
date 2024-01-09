package im.willy.butler.Adapters.Telegram.Commands;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import im.willy.butler.Adapters.Telegram.MessageMockBuilder;
import im.willy.butler.Adapters.Telegram.TelegramUtils;
import im.willy.butler.Models.User;
import im.willy.butler.Services.UserService;

@ExtendWith(MockitoExtension.class)
public class StartCommandTest {
    @Mock
    private TelegramUtils utils;

    @Mock
    private UserService userService;

    @InjectMocks
    private StartCommand command;

    @Test
    void testHandle() throws TelegramApiException {
        Message message = new MessageMockBuilder()
                .mockChatId(1L)
                .mockSenderId(99L)
                .mockSenderFirstName("testName")
                .build();

        when(userService.findOrInsertUserByAdapterId("99", "testName"))
                .thenReturn(new User("testName", "99"));

        command.Handle(message);

        verify(utils, times(1)).replyChat(1L, StartCommand.getResponse("testName"));
        verify(utils, times(1)).replyChat(1L, StartCommand.getResponse("testName"));
    }

    @Test
    void testGetName() {
        assertEquals(command.getName(), "/start");
    }
}
