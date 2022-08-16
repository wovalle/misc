package im.willy.butler.Adapters.DialogFlow;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.cloud.dialogflow.v2.QueryResult;

import im.willy.butler.Actions.IButlerActionResult;
import im.willy.butler.Actions.PassthroughMessageAction;
import im.willy.butler.Actions.ScheduleMessageAction;
import im.willy.butler.Exceptions.DialogFlowIntentMissingException;

@Component
public class DialogFlowIntentResultHandler {

    @Autowired
    private QueryResultParamExtractor paramExtractor;

    public IButlerActionResult HandleButlerAction(QueryResult queryResult) throws DialogFlowIntentMissingException {
        String fulfillmentText = queryResult.getFulfillmentText();
        String intentDisplayName = queryResult
                .getIntent()
                .getDisplayName();

        DialogFlowIntent intent = DialogFlowIntent.fromText(intentDisplayName);

        if (!queryResult.getAllRequiredParamsPresent()) {
            return new PassthroughMessageAction(fulfillmentText);
        }

        switch (intent) {
            case NameGet:
            case GreetingsGet:
            case WelcomeGet:
            case FeaturesGet: {
                return new PassthroughMessageAction(fulfillmentText);
            }

            case ReminderSet: {
                if (queryResult.getAllRequiredParamsPresent()) {
                    var reminderDate = paramExtractor.ExtractDate(queryResult, "date");
                    var reminderText = paramExtractor.ExtractString(queryResult, "text");

                    return new ScheduleMessageAction(fulfillmentText, reminderText, reminderDate);
                }

                return new PassthroughMessageAction(fulfillmentText);
            }

            default:
                return new PassthroughMessageAction(fulfillmentText);
        }
    }
}
