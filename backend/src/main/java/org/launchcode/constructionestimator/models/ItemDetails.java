package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
public class ItemDetails extends AbstractEntity {

    @ManyToOne
    @JsonBackReference
    private Project project;


    private int itemId;

    private double quantity;

    private int finalPrice;

    public ItemDetails() {}


    public ItemDetails(Project project, int itemId) {
        this.project = project;
        this.itemId = itemId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
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

    public int getPriceEstimate() {
        return finalPrice;
    }

    public void setPriceEstimate(int priceEstimate) {
        this.finalPrice = priceEstimate;
    }
}
