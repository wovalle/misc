package im.willy.butler.Exceptions;

public class DialogFlowIntentMissingException extends Exception {

    private String intentText;

    public String getIntentText() {
        return intentText;
    }

    public DialogFlowIntentMissingException(String intentText) {
        super("Unknown DialogFlow Intent: " + intentText);

        this.intentText = intentText;
    }
}
