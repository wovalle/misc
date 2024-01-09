package im.willy.butler.Adapters.DialogFlow;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.ZonedDateTime;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.google.cloud.dialogflow.v2.QueryResult;

import im.willy.butler.Actions.ButlerActions;
import im.willy.butler.Actions.ScheduleMessageAction;
import im.willy.butler.Exceptions.DialogFlowIntentMissingException;

@ExtendWith(MockitoExtension.class)
public class DialogFlowIntentResultHandlerTest {
        @Mock
        private QueryResultParamExtractor paramExtractor;

        @InjectMocks
        DialogFlowIntentResultHandler intentResultHandler;

        @Test
        void testHandleButlerAction_whenSettingReminder() throws DialogFlowIntentMissingException {
                var queryResult = mock(QueryResult.class, RETURNS_DEEP_STUBS);
                var date = ZonedDateTime.now();

                when(queryResult.getFulfillmentText()).thenReturn("fulfillment text");
                when(queryResult.getIntent().getDisplayName())
                                .thenReturn(DialogFlowIntent.ReminderSet.getText());

                when(queryResult.getAllRequiredParamsPresent())
                                .thenReturn(true);

                when(paramExtractor.ExtractDate(any(QueryResult.class), eq("date")))
                                .thenReturn(date);

                when(paramExtractor.ExtractString(any(QueryResult.class), eq("text")))
                                .thenReturn("reminder text");

                var result = (ScheduleMessageAction) intentResultHandler.HandleButlerAction(queryResult);

                assertEquals(result.getAction(), ButlerActions.ScheduleMessage);
                assertEquals(result.getText(), "fulfillment text");
                assertEquals(result.reminderDate, date);
        }

        @Test
        void testHandleButlerAction_whenGettingName() throws DialogFlowIntentMissingException {
                var queryResult = mock(QueryResult.class, RETURNS_DEEP_STUBS);

                when(queryResult.getFulfillmentText()).thenReturn("fulfillment text");
                when(queryResult.getIntent().getDisplayName())
                                .thenReturn(DialogFlowIntent.NameGet.getText());

                var result = intentResultHandler.HandleButlerAction(queryResult);

                assertEquals(result.getAction(), ButlerActions.PassthroughMessage);
                assertEquals(result.getText(), "fulfillment text");
        }

        @Test
        void testHandleButlerAction_whenGettingGreetings() throws DialogFlowIntentMissingException {
                var queryResult = mock(QueryResult.class, RETURNS_DEEP_STUBS);

                when(queryResult.getFulfillmentText()).thenReturn("fulfillment text");
                when(queryResult.getIntent().getDisplayName())
                                .thenReturn(DialogFlowIntent.GreetingsGet.getText());

                var result = intentResultHandler.HandleButlerAction(queryResult);

                assertEquals(result.getAction(), ButlerActions.PassthroughMessage);
                assertEquals(result.getText(), "fulfillment text");
        }

        @Test
        void testHandleButlerAction_whenGettingFeatures() throws DialogFlowIntentMissingException {
                var queryResult = mock(QueryResult.class, RETURNS_DEEP_STUBS);

                when(queryResult.getFulfillmentText()).thenReturn("fulfillment text");
                when(queryResult.getIntent().getDisplayName())
                                .thenReturn(DialogFlowIntent.GreetingsGet.getText());

                var result = intentResultHandler.HandleButlerAction(queryResult);

                assertEquals(result.getAction(), ButlerActions.PassthroughMessage);
                assertEquals(result.getText(), "fulfillment text");
        }

        @Test
        void testHandleButlerAction_whenGettingDefault() throws DialogFlowIntentMissingException {
                var queryResult = mock(QueryResult.class, RETURNS_DEEP_STUBS);

                when(queryResult.getFulfillmentText()).thenReturn("fulfillment text");
                when(queryResult.getIntent().getDisplayName())
                                .thenReturn(DialogFlowIntent.Default.getText());

                var result = intentResultHandler.HandleButlerAction(queryResult);

                assertEquals(result.getAction(), ButlerActions.PassthroughMessage);
                assertEquals(result.getText(), "fulfillment text");
        }

        @Test
        void testHandleButlerAction_whenRequiredParamsNotPresent() throws DialogFlowIntentMissingException {
                var queryResult = mock(QueryResult.class, RETURNS_DEEP_STUBS);

                when(queryResult.getAllRequiredParamsPresent()).thenReturn(false);
                when(queryResult.getFulfillmentText()).thenReturn("fulfillment text");
                when(queryResult.getIntent().getDisplayName())
                                .thenReturn(DialogFlowIntent.Default.getText());

                var result = intentResultHandler.HandleButlerAction(queryResult);

                assertEquals(result.getAction(), ButlerActions.PassthroughMessage);
                assertEquals(result.getText(), "fulfillment text");
        }
}
