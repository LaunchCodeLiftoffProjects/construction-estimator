package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class ItemDetails extends AbstractEntity {

    @ManyToOne
    @JsonBackReference
    private Project project;

    // This should be another entity on the database with common item fields
    @ManyToOne
    private Item item;

    private int quantity;
    private int finalPrice;

    public ItemDetails() {}

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPriceEstimate() {
        return finalPrice;
    }

    public void setPriceEstimate(int priceEstimate) {
        this.finalPrice = priceEstimate;
    }
}
