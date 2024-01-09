package im.willy.butler.Adapters.DialogFlow;

import java.time.ZonedDateTime;

import org.springframework.stereotype.Component;

import com.google.cloud.dialogflow.v2.QueryResult;

@Component
public class QueryResultParamExtractor {
    public ZonedDateTime ExtractDate(QueryResult queryResult, String fieldName) {
        var isoDateString = queryResult.getParameters()
                .getFieldsOrThrow(fieldName)
                .getStructValue()
                .getFieldsOrThrow("date_time")
                .getStringValue();

        return ZonedDateTime.parse(isoDateString);
    }

    public String ExtractString(QueryResult queryResult, String fieldName) {
        return queryResult
                .getParameters()
                .getFieldsOrThrow(fieldName)
                .getStringValue();
    }
}
