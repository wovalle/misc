package im.willy.butler.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import im.willy.butler.Models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public User findUserByAdapterId(String adapterId);
}
