package org.launchcode.constructionestimator.payload.request;

import org.launchcode.constructionestimator.models.ItemDetails;
import org.launchcode.constructionestimator.models.Labor;
import org.launchcode.constructionestimator.models.Materials;

import java.util.ArrayList;
import java.util.List;

public class ProjectDetailsRequest {

    private List<ItemDetails> itemDetails = new ArrayList<>();

    private Labor labor;
    private Materials materials;

    public ProjectDetailsRequest() {}

    public List<ItemDetails> getItemDetailsList() {
        return itemDetails;
    }

    public Labor getLabor() {
        return labor;
    }

    public Materials getMaterials() {
        return materials;
    }

    public void setItemDetails(List<ItemDetails> itemDetails) {
        this.itemDetails = itemDetails;
    }

    public void setLabor(Labor labor) {
        this.labor = labor;
    }

    public void setMaterials(Materials materials) {
        this.materials = materials;
    }
}
