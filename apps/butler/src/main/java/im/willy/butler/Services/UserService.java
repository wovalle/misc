package im.willy.butler.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import im.willy.butler.Models.User;
import im.willy.butler.Repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findOrInsertUserByAdapterId(String adapterId, String name) {
        var user = userRepository.findUserByAdapterId(adapterId);

        if (user == null) {
            user = userRepository.save(new User(name, adapterId));
        }

        return user;
    }

    public User findUserByAdapterId(String adapterId) {
        return userRepository.findUserByAdapterId(adapterId);
    }
}
