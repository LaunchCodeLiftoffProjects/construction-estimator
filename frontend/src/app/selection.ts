
export class Selection {

    category: string;
    type: string;
    checked: boolean;
    selected: string;
    quantity: number;

    constructor(category: string, type: string, checked?: boolean, selected: string = "", quantity: number = 0) {
        this.category = category;
        this.type = type;
        this.checked = checked ? checked : false;
        this.selected = selected; // until selection is made from drop-down box or details are returned from saved project
        this.quantity = quantity; // if item is one that is based on SF or LF, calculations will change this, not form
    }

}
