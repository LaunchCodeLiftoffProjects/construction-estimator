
import { Item } from "src/app/item";

export class Selection {

    // does not contain itemID because instances of this class must remain open to any item of this type until an option is chosen in the form
    // a string match on the 'selected' property will assign the itemID to the itemDetails object that will be saved to the project

    category: string;
    type: string;
    checked: boolean;
    selected: Item;
    quantity: number;

    constructor(category: string, type: string, checked?: boolean, selected: Item = null, quantity: number = 0) {
        this.category = category;
        this.type = type;
        this.checked = checked ? checked : false;
        this.selected = selected; // until selection is made from drop-down box or details are returned from saved project
        this.quantity = quantity; // if item is one that not quantity-based, calculations will ignore this
    }

}
