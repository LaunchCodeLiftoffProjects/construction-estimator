package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@AttributeOverride(name = "name", column = @Column(name="email"))
public class User extends NamedEntity {

    private String FirstName;
    private String lastName;

    private String password;

    @OneToMany
    @JoinColumn(name="user_id")
    private List<Project> projects = new ArrayList<>();

    @OneToOne
    private UserDetails userDetails;

    // allows us to use email for the field name instead of user in sent and received JSON
    @Override
    @JsonSetter("email")
    public void setName(String name) {
        this.name = name;
    }

    @Override
    @JsonGetter("email")
    public String getName() {
        return name;
    }

    public String getFirstName() {
        return FirstName;
    }

    public void setFirstName(String firstName) {
        FirstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public UserDetails getUserDetails() {
        return userDetails;
    }

    public void setUserDetails(UserDetails userDetails) {
        this.userDetails = userDetails;
    }
}
