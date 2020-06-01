package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class ItemDetails extends AbstractEntity {

    @ManyToOne
    @JsonBackReference
    private Project project;

    // references an id in items.json, these ids are unique to item but not unique to anything else
    private int itemId;

    private double quantity;

    public ItemDetails() {}

    public ItemDetails(Project project, int itemId) {
        this.project = project;
        this.itemId = itemId;
    }
    public ItemDetails(Project project) {
        this.project = project;

    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

}
