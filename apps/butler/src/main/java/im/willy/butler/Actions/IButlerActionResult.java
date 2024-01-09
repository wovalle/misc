package im.willy.butler.Actions;

public interface IButlerActionResult {
    public ButlerActions getAction();

    public boolean hasText();

    public String getText();
}
