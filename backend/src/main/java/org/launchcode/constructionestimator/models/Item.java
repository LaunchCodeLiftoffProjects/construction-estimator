package org.launchcode.constructionestimator.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Item extends NamedEntity {

    private String description;
    private int price;

    // Maybe an enum here. Will be either Fixture, appliance, or finish
    private String category;
    // removing this for now, was originally things like "flooring"
    //private String type;

    @OneToMany
    @JoinColumn(name = "item_id")
    @JsonBackReference
    private List<ItemDetails> itemDetails = new ArrayList<>();

    public Item() {}

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<ItemDetails> getItemDetails() {
        return itemDetails;
    }

    public void setItemDetails(List<ItemDetails> itemDetails) {
        this.itemDetails = itemDetails;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

//    public String getType() {
//        return type;
//    }
//
//    public void setType(String type) {
//        this.type = type;
//    }
}
