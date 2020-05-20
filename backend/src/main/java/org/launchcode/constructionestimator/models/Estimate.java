package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.OneToOne;

public class Estimate extends AbstractEntity {

    private float appliancesCost;
    private float fixturesCost;
    private float finishesCost;
    private float materialsCost;
    private float laborCost;
    private float totalCost;

    @OneToOne
    @JsonBackReference
    private Project project;

    public Estimate() { }

    public float getAppliancesCost() {
        return appliancesCost;
    }

    public void setAppliancesCost(float appliancesCost) {
        this.appliancesCost = appliancesCost;
    }

    public float getFixturesCost() {
        return fixturesCost;
    }

    public void setFixturesCost(float fixturesCost) {
        this.fixturesCost = fixturesCost;
    }

    public float getFinishesCost() {
        return finishesCost;
    }

    public void setFinishesCost(float finishesCost) {
        this.finishesCost = finishesCost;
    }

    public float getMaterialsCost() {
        return materialsCost;
    }

    public void setMaterialsCost(float materialsCost) {
        this.materialsCost = materialsCost;
    }

    public float getLaborCost() {
        return laborCost;
    }

    public void setLaborCost(float laborCost) {
        this.laborCost = laborCost;
    }

    public float getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(float totalCost) {
        this.totalCost = totalCost;
    }
}
