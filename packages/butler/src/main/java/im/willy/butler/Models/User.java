package im.willy.butler.Models;

import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "\"User\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column
    private String name;

    @Column(unique = true)
    private String adapterId;

    @OneToMany(mappedBy = "user")
    private Set<Reminder> reminders;

    public User(Long id, String name, String adapterId) {
        this.id = id;
        this.name = name;
        this.adapterId = adapterId;
    }

    public User() {
    }

    public User(Long id) {
        this.id = id;
    }

    public User(String name, String adapterId) {
        this.name = name;
        this.adapterId = adapterId;
    }

    public String getName() {
        return name;
    }
}
