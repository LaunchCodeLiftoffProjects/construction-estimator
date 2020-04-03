package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class ProjectDetails extends AbstractEntity {

    @JsonBackReference
    @OneToOne
    private Project project;



    ProjectDetails() {}

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
