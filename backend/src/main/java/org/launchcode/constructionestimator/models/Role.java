package org.launchcode.constructionestimator.models;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Entity
public class Role {

    @Enumerated(EnumType.STRING)
    private ERole name;

    public Role() { }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }
}
