package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Item extends NamedEntity {

    private String description;
    private int price;

    private String category; // Maybe an enum here.
    private String type;     // Maybe an enum here.

    @OneToMany
    @JoinColumn(name = "item_id")
    @JsonBackReference
    private List<ProjectComponent> projectComponents = new ArrayList<>();

    public Item() {}

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<ProjectComponent> getProjectComponents() {
        return projectComponents;
    }

    public void setProjectComponents(List<ProjectComponent> projectComponents) {
        this.projectComponents = projectComponents;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
