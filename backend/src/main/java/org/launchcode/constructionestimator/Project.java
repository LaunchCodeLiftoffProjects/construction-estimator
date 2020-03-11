package org.launchcode.constructionestimator;

public class Project {

    private int projectId;
    private static int nextId;
    private String projectName;
    private String roomType;
    private int roomLength;
    private int roomWidth;
    private int roomHeight;
    private User projectOwner;

//    No quantities for these yet, can add later...
    private String fixturesList;
    private String appliancesList;
    private String finishesList;
//    Only have boolean for this right now, can change it later to distinguish between types of contract work
    private boolean needSubcontractor;

    public Project(String projectName) {
        this.projectName = projectName;
        this.projectId = nextId;
        nextId++;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

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

    public String getFixturesList() {
        return fixturesList;
    }

    public void setFixturesList(String fixturesList) {
        this.fixturesList = fixturesList;
    }

    public String getAppliancesList() {
        return appliancesList;
    }

    public void setAppliancesList(String appliancesList) {
        this.appliancesList = appliancesList;
    }

    public String getFinishesList() {
        return finishesList;
    }

    public void setFinishesList(String finishesList) {
        this.finishesList = finishesList;
    }

    public boolean isNeedSubcontractor() {
        return needSubcontractor;
    }

    public void setNeedSubcontractor(boolean needSubcontractor) {
        this.needSubcontractor = needSubcontractor;
    }

    public User getProjectOwner() {
        return projectOwner;
    }

    public void setProjectOwner(User projectOwner) {
        this.projectOwner = projectOwner;
    }

    public int getProjectId() {
        return projectId;
    }
}
