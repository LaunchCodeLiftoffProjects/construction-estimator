package org.launchcode.constructionestimator.models;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Project extends NamedEntity {

    private String roomType;

    private int roomLength;
    private int roomWidth;
    private int roomHeight;

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
    private List<ProjectComponent> projectComponents = new ArrayList<>();

    // necessary for hibernate to use model binding I think
    public Project() {}

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public int getRoomLength() {
        return roomLength;
    }

    public void setRoomLength(int roomLength) {
        this.roomLength = roomLength;
    }

    public int getRoomWidth() {
        return roomWidth;
    }

    public void setRoomWidth(int roomWidth) {
        this.roomWidth = roomWidth;
    }

    public int getRoomHeight() {
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

    public List<ProjectComponent> getProjectComponents() {
        return projectComponents;
    }

    public void setProjectComponents(List<ProjectComponent> projectComponents) {
        this.projectComponents = projectComponents;
    }
}
