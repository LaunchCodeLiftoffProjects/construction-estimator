package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSetter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@AttributeOverride(name = "name", column = @Column(name="email"))
public class User extends NamedEntity {

    private String firstName;
    private String lastName;

    @JsonIgnore
    private String password;

    @OneToMany
    @JoinColumn(name="user_id")
    private List<Project> projects = new ArrayList<>();

    @OneToOne
    private HomeDetails homeDetails;

    @ManyToMany
    private Set<Role> roles = new HashSet<>();

    public User(String firstName, String lastName, String email, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.name = email;
        this.password = password;
    }

    public User() { }

    // allows us to use email for the field name instead of name in sent and received JSON
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
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
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

    public HomeDetails getHomeDetails() {
        return homeDetails;
    }

    public void setHomeDetails(HomeDetails homeDetails) {
        this.homeDetails = homeDetails;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}
