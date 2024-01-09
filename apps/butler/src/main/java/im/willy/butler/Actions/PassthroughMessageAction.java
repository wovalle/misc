
package im.willy.butler.Actions;

public class PassthroughMessageAction implements IButlerActionResult {

    public String text;

    public PassthroughMessageAction(String text) {
        this.text = text;
    }

    @Override
    public ButlerActions getAction() {
        return ButlerActions.PassthroughMessage;
    }

    @Override
    public String getText() {
        return this.text;
    }

    @Override
    public boolean hasText() {
        return !this.text.isEmpty();
    }
}