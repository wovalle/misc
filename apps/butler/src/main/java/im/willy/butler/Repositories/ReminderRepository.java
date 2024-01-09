package im.willy.butler.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import im.willy.butler.Models.Reminder;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

}
