package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.ManyToOne;

public class ProjectComponent extends AbstractEntity {

    @ManyToOne
    @JsonBackReference
    private Project project;

    // This should be another entity on the database with common item fields
    private String item;
    private String componentType;

    private int quantity;
    private boolean installation;

    private int priceEstimate;

    public ProjectComponent() {}

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getItem() {
        return item;
    }

    public void setItem(String item) {
        this.item = item;
    }

    public String getComponentType() {
        return componentType;
    }

    public void setComponentType(String componentType) {
        this.componentType = componentType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public boolean isInstallation() {
        return installation;
    }

    public void setInstallation(boolean installation) {
        this.installation = installation;
    }

    public int getPriceEstimate() {
        return priceEstimate;
    }

    public void setPriceEstimate(int priceEstimate) {
        this.priceEstimate = priceEstimate;
    }
}
