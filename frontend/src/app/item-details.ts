import { Item } from './item';
import { Project } from './project';

export class ItemDetails {

    id: number;
    itemId: number;
    quantity: number;
    finalPrice: number;

    constructor(itemId: number) {
        this.id = null;
        this.itemId = itemId;
        this.quantity = 0;
        this.finalPrice = 0;
    }

}