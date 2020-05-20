import { ItemDetails } from './item-details';
import { Materials } from './materials';
import { Labor } from './labor';

export class ProjectDetailsPayload {

    itemDetails: ItemDetails[];
    labor: Labor;
    materials: Materials;

    constructor(itemDetails: ItemDetails[], labor: Labor, materials: Materials) {
        this.itemDetails = itemDetails;
        this.labor = labor;
        this.materials = materials;
    }
}
