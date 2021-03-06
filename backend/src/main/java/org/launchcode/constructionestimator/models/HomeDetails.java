package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class HomeDetails extends AbstractEntity {

    private int homeAge;
    private String homeBuild;
    private String homeNotes;

    public HomeDetails() {}

    public int getHomeAge() {
        return homeAge;
    }

    public void setHomeAge(int homeAge) {
        this.homeAge = homeAge;
    }

    public String getHomeBuild() {
        return homeBuild;
    }

    public void setHomeBuild(String homeBuild) {
        this.homeBuild = homeBuild;
    }

    public String getHomeNotes() {
        return homeNotes;
    }

    public void setHomeNotes(String homeNotes) {
        this.homeNotes = homeNotes;
    }
}
