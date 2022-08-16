package im.willy.butler.Services;

import java.time.ZonedDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import im.willy.butler.Models.Reminder;
import im.willy.butler.Models.User;
import im.willy.butler.Repositories.ReminderRepository;

@Service
public class ReminderService {

    @Autowired
    private ReminderRepository reminderRepository;

    public void saveReminder(User user, String text, ZonedDateTime date) {

        var reminder = new Reminder(text, date, user);

        reminderRepository.save(reminder);
    }
}
