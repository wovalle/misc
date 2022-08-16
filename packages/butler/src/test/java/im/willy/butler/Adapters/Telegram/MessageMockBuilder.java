package im.willy.butler.Adapters.Telegram;

import org.telegram.telegrambots.meta.api.objects.Message;

import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.mockito.Mock;

public class MessageMockBuilder {

    @Mock
    private Message message;

    public MessageMockBuilder() {
        message = mock(Message.class, RETURNS_DEEP_STUBS);
    }

    public MessageMockBuilder mockChatId(Long id) {
        when(message.getChatId()).thenReturn(id);
        return this;
    }

    public MessageMockBuilder mockText(String text) {
        when(message.getText()).thenReturn(text);
        return this;
    }

    public MessageMockBuilder mockSenderId(long id) {
        when(message.getFrom().getId()).thenReturn(id);
        return this;
    }

    public MessageMockBuilder mockSenderFirstName(String name) {
        when(message.getFrom().getFirstName()).thenReturn(name);
        return this;
    }

    public Message build() {
        return this.message;
    }
}
