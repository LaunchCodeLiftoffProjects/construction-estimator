
export class Selection {

    type: string;
    isIncluded: boolean;
    selection: string;
    quantity: number;

    constructor(type: string) {
        this.type = type;
        this.isIncluded = false;
        this.selection = "";
        this.quantity = 0;
    }

}
