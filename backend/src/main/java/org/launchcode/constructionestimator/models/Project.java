package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Project extends NamedEntity {

    private String roomType;

    private double roomLength;
    private double roomWidth;
    private double roomHeight;

    private boolean needElectrician;
    private boolean needPlumber;
    private boolean needCarpenter;

    private int fixturesCost;
    private int appliancesCost;
    private int finishesCost;

    private int materialsCost;
    private int laborCost;

    @OneToMany
    @JoinColumn(name="project_id")
    private List<ItemDetails> itemDetails = new ArrayList<>();

    @ManyToOne
    @JsonBackReference
    private User user;

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

    public void setRoomLength(int roomLength) {
        this.roomLength = roomLength;
    }

    public double getRoomWidth() {
        return roomWidth;
    }

    public void setRoomWidth(int roomWidth) {
        this.roomWidth = roomWidth;
    }

    public double getRoomHeight() {
        return roomHeight;
    }

    public void setRoomHeight(int roomHeight) {
        this.roomHeight = roomHeight;
    }

    public boolean isNeedElectrician() {
        return needElectrician;
    }

    public void setNeedElectrician(boolean needElectrician) {
        this.needElectrician = needElectrician;
    }

    public boolean isNeedPlumber() {
        return needPlumber;
    }

    public void setNeedPlumber(boolean needPlumber) {
        this.needPlumber = needPlumber;
    }

    public boolean isNeedCarpenter() {
        return needCarpenter;
    }

    public void setNeedCarpenter(boolean needCarpenter) {
        this.needCarpenter = needCarpenter;
    }

    public int getFixturesCost() {
        return fixturesCost;
    }

    public void setFixturesCost(int fixturesCost) {
        this.fixturesCost = fixturesCost;
    }

    public int getAppliancesCost() {
        return appliancesCost;
    }

    public void setAppliancesCost(int appliancesCost) {
        this.appliancesCost = appliancesCost;
    }

    public int getFinishesCost() {
        return finishesCost;
    }

    public void setFinishesCost(int finishesCost) {
        this.finishesCost = finishesCost;
    }

    public int getMaterialsCost() {
        return materialsCost;
    }

    public void setMaterialsCost(int materialsCost) {
        this.materialsCost = materialsCost;
    }

    public int getLaborCost() {
        return laborCost;
    }

    public void setLaborCost(int laborCost) {
        this.laborCost = laborCost;
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
}
