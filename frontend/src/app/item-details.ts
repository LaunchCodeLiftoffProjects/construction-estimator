import { Item } from './item';
import { Project } from './project';

export class ItemDetails {

    id: number;
    itemId: number;
    quantity: number;

    constructor(itemId: number) {
        this.id = null; // assigned by hibernate on back end
        this.itemId = itemId;
        this.quantity = 0;
    }

}