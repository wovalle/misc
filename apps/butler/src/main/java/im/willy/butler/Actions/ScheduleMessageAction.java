package im.willy.butler.Actions;

import java.time.ZonedDateTime;

public class ScheduleMessageAction implements IButlerActionResult {

    public String fullfilmentText;
    public String reminderText;
    public ZonedDateTime reminderDate;

    public ScheduleMessageAction(String fullfilmentText, String reminderText, ZonedDateTime scheduleTime) {
        this.fullfilmentText = fullfilmentText;
        this.reminderText = reminderText;
        this.reminderDate = scheduleTime;
    }

    public String getReminderText() {
        return reminderText;
    }

    public ZonedDateTime reminderDate() {
        return reminderDate;
    }

    @Override
    public ButlerActions getAction() {
        return ButlerActions.ScheduleMessage;
    }

    @Override
    public String getText() {
        return this.fullfilmentText;
    }

    @Override
    public boolean hasText() {
        return !this.fullfilmentText.isEmpty();
    }
}