package org.launchcode.constructionestimator.models;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class Project extends NamedEntity {

    // TODO: Refactor to use sub-object depending on how we want to impliment
    private String roomType;

    private int roomLength;
    private int roomWidth;
    private int roomHeight;

    @OneToOne
    private ProjectDetails projectDetails;

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

    public ProjectDetails getProjectDetails() {
        return projectDetails;
    }

    public void setProjectDetails(ProjectDetails projectDetails) {
        this.projectDetails = projectDetails;
    }
}
