package org.launchcode.constructionestimator.payload.request;

import org.launchcode.constructionestimator.models.ItemDetails;
import org.launchcode.constructionestimator.models.Labor;
import org.launchcode.constructionestimator.models.Materials;

import java.util.ArrayList;
import java.util.List;

public class ProjectDetailsRequest {

    private List<ItemDetails> itemDetailsList;

    private Labor labor;
    private Materials materials;

    public ProjectDetailsRequest(List<ItemDetails> itemDetailsList, Labor labor, Materials materials) {
        this.itemDetailsList = itemDetailsList;
        this.labor = labor;
        this.materials = materials;
    }

    public List<ItemDetails> getItemDetailsList() {
        return itemDetailsList;
    }

    public void setItemDetailsList(List<ItemDetails> itemDetailsList) {
        this.itemDetailsList = itemDetailsList;
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
}
