package im.willy.butler.Adapters.DialogFlow;

import im.willy.butler.Exceptions.DialogFlowIntentMissingException;

public enum DialogFlowIntent {
    FeaturesGet("features.get"),
    NameGet("botname.get"),
    ReminderSet("reminder.set"),
    RecurrentReminderSet("recurrentreminder.set"),
    GreetingsGet("greetings.get"),
    WelcomeGet("welcome.get"),
    Default("default");

    public final String intentText;

    DialogFlowIntent(String intentText) {
        this.intentText = intentText;
    }

    public final String getText() {
        return intentText;
    }

    public static DialogFlowIntent fromText(String intentText) throws DialogFlowIntentMissingException {
        for (DialogFlowIntent intent : values()) {
            if (intent.getText().equalsIgnoreCase(intentText)) {
                return intent;
            }
        }

        throw new DialogFlowIntentMissingException(intentText);
    }
}