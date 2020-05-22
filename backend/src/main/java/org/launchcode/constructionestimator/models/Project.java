package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Project extends NamedEntity {

    private String roomType;

    private double roomLength;
    private double roomWidth;
    private double roomHeight;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="project_id")
    private List<ItemDetails> itemDetails = new ArrayList<>();

    @ManyToOne
    @JsonBackReference
    private User user;

    @OneToOne(cascade = CascadeType.ALL)
    private Labor labor;

    @OneToOne(cascade = CascadeType.ALL)
    private Materials materials;

    @OneToOne(cascade = CascadeType.ALL)
    private Estimate estimate;

    // necessary for hibernate to use model binding I think
    public Project() {}

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public double getRoomLength() {
        return roomLength;
    }

    public void setRoomLength(double roomLength) {
        this.roomLength = roomLength;
    }

    public double getRoomWidth() {
        return roomWidth;
    }

    public void setRoomWidth(double roomWidth) {
        this.roomWidth = roomWidth;
    }

    public double getRoomHeight() {
        return roomHeight;
    }

    public void setRoomHeight(double roomHeight) {
        this.roomHeight = roomHeight;
    }

    public List<ItemDetails> getItemDetails() {
        return itemDetails;
    }

    public void setItemDetails(List<ItemDetails> itemDetails) {
        this.itemDetails = itemDetails;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Labor getLabor() {
        return labor;
    }

    public void setLabor(Labor labor) {
        this.labor = labor;
    }

    public Materials getMaterials() {
        return materials;
    }

    public void setMaterials(Materials materials) {
        this.materials = materials;
    }

    public Estimate getEstimate() {
        return estimate;
    }

    public void setEstimate(Estimate estimate) {
        this.estimate = estimate;
    }
}
