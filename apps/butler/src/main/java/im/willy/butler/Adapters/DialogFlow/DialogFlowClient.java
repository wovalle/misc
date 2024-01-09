package im.willy.butler.Adapters.DialogFlow;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.google.cloud.dialogflow.v2.QueryInput;
import com.google.cloud.dialogflow.v2.QueryResult;
import com.google.cloud.dialogflow.v2.SessionName;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.SessionsSettings;
import com.google.cloud.dialogflow.v2.TextInput;

@Component
public class DialogFlowClient {

    @Value("${dialogflow.credentials.base64}")
    private String encodedCredentials;

    private ServiceAccountCredentials credentials;

    public DialogFlowClient() {
    }

    public void parseCredentials() throws IOException {
        var base64Stream = Base64.getDecoder().decode(encodedCredentials);

        this.credentials = ServiceAccountCredentials.fromStream(new ByteArrayInputStream(base64Stream));
    }

    public SessionsSettings getSessionSettings() throws IOException {
        if (this.credentials == null) {
            this.parseCredentials();
        }

        SessionsSettings.Builder settingsBuilder = SessionsSettings.newBuilder();

        SessionsSettings sessionsSettings = settingsBuilder
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();

        return sessionsSettings;
    }

    public QueryResult analyzeIntentInText(String sessionId, String queryText)
            throws IOException {
        var sessionSettings = this.getSessionSettings();

        try (SessionsClient sessionsClient = SessionsClient.create(sessionSettings)) {

            var session = SessionName.of(this.credentials.getProjectId(), sessionId);

            TextInput.Builder textInput = TextInput
                    .newBuilder()
                    .setText(queryText)
                    .setLanguageCode("en-us");

            // Build the query with the TextInput
            QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

            // Performs the detect intent request
            DetectIntentResponse response = sessionsClient.detectIntent(session, queryInput);

            // Debug Info
            System.out.println(String.format("[Analyze Intent]\nResolvedIntent: %s\n",
                    response.getQueryResult().getIntent().getDisplayName()));

            // Return the query result;
            return response.getQueryResult();
        }
    }
}
