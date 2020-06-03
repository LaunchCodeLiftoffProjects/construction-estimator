
import { Item } from "src/app/item";

export class Selection {

    category: string;
    type: string;
    checked: boolean;
    selected: Item;
    quantity: number;
    costs: number[]; // for dynamic estimating

    constructor(category: string, type: string, checked?: boolean, selected: Item = null, quantity: number = 0, costs: number[] = [0,0,0]) {
        this.category = category;
        this.type = type;
        this.checked = checked ? checked : false;
        this.selected = selected; // until selection is made from drop-down box or details are returned from saved project
        this.quantity = quantity; // if item is one that not quantity-based, calculations will ignore this
        this.costs = costs; // defaults to zero unless itemDetails is created/accessed
    }

}
