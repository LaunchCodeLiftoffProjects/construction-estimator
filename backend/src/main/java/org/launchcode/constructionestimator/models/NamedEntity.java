package org.launchcode.constructionestimator.models;

import javax.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class NamedEntity extends AbstractEntity {

    // TODO: Apply validation to this? Not sure how it works when also using angular
    protected String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
