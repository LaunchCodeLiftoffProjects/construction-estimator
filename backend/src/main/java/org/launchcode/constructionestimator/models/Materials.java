package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class Materials extends AbstractEntity {

    private boolean needPlumbingSystem;
    private boolean needElectricalSystem;
    private boolean needFraming;
    private boolean needDrywall;

    @OneToOne
    @JsonBackReference
    private Project project;

    public boolean isNeedPlumbingSystem() {
        return needPlumbingSystem;
    }

    public void setNeedPlumbingSystem(boolean needPlumbingSystem) {
        this.needPlumbingSystem = needPlumbingSystem;
    }

    public boolean isNeedElectricalSystem() {
        return needElectricalSystem;
    }

    public void setNeedElectricalSystem(boolean needElectricalSystem) {
        this.needElectricalSystem = needElectricalSystem;
    }

    public boolean isNeedFraming() {
        return needFraming;
    }

    public void setNeedFraming(boolean needFraming) {
        this.needFraming = needFraming;
    }

    public boolean isNeedDrywall() {
        return needDrywall;
    }

    public void setNeedDrywall(boolean needDrywall) {
        this.needDrywall = needDrywall;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
