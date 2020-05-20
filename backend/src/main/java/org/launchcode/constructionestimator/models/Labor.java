package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

@Entity
public class Labor extends AbstractEntity {

    private boolean needPlumbingSub;
    private boolean needElectricalSub;
    private boolean needRoughCarpentry;
    private boolean needFinishWork;

    @OneToOne
    @JsonBackReference
    private Project project;

    public Labor() {}

    public boolean isNeedPlumbingSub() {
        return needPlumbingSub;
    }

    public void setNeedPlumbingSub(boolean needPlumbingSub) {
        this.needPlumbingSub = needPlumbingSub;
    }

    public boolean isNeedElectricalSub() {
        return needElectricalSub;
    }

    public void setNeedElectricalSub(boolean needElectricalSub) {
        this.needElectricalSub = needElectricalSub;
    }

    public boolean isNeedRoughCarpentry() {
        return needRoughCarpentry;
    }

    public void setNeedRoughCarpentry(boolean needRoughCarpentry) {
        this.needRoughCarpentry = needRoughCarpentry;
    }

    public boolean isNeedFinishWork() {
        return needFinishWork;
    }

    public void setNeedFinishWork(boolean needFinishWork) {
        this.needFinishWork = needFinishWork;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
