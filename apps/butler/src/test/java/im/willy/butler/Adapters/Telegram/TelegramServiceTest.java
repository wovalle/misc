package im.willy.butler.Adapters.Telegram;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import im.willy.butler.Adapters.Telegram.Commands.ITelegramCommandHandler;
import im.willy.butler.Exceptions.DialogFlowIntentMissingException;

@ExtendWith(MockitoExtension.class)
public class TelegramServiceTest {
    @Mock
    private TelegramMessagePassthroughHandler passthroughHandler;

    @Spy
    private ArrayList<ITelegramCommandHandler> commandHandlers;

    @Mock
    private ITelegramCommandHandler commandHandler;

    @Captor
    private final ArgumentCaptor<Message> messageCaptor = ArgumentCaptor.forClass(Message.class);

    @InjectMocks
    TelegramService service;

    @BeforeEach
    void setup() {
        commandHandlers.add(commandHandler);
    }

    @Test
    void shouldCallPassthroughHandlerIfTelegramMessageHasNoCommands() throws TelegramApiException {
        var message = mock(Message.class);
        var update = mock(Update.class);

        when(update.getMessage()).thenReturn(message);
        when(message.isCommand()).thenReturn(false);

        doNothing()
                .when(passthroughHandler).Handle(any(Message.class));

        service.OnUpdateReceived(update);

        verify(passthroughHandler).Handle(messageCaptor.capture());
        assertEquals(messageCaptor.getValue(), message);
    }

    @Test
    void shouldCallTelegramCommandHandler() throws TelegramApiException, IOException, DialogFlowIntentMissingException {
        var message = mock(Message.class, RETURNS_DEEP_STUBS);
        var update = mock(Update.class);

        when(message.isCommand()).thenReturn(true);

        when(message
                .getEntities()
                .get(0)
                .getText()).thenReturn("/mock");

        when(update.getMessage()).thenReturn(message);

        when(commandHandler.getName())
                .thenReturn("/mock");

        doNothing().when(commandHandler).Handle(any(Message.class));

        service.OnUpdateReceived(update);

        verify(commandHandler).Handle(update.getMessage());
    }
}
