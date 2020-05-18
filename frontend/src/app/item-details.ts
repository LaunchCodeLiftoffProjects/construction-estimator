import { Item } from './item';
import { Project } from './project';

export class ItemDetails {

    itemId: number;
    quantity: number;
    finalPrice: number;

    constructor(id: number) {
        this.itemId = id;
        this.quantity = 0;
        this.finalPrice = 0;
    }

}