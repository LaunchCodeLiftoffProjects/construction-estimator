import { ItemDetails } from './item-details';
import { Materials } from './materials';
import { Labor } from './labor';
import { Estimate } from './estimate';

export class ProjectDetailsPayload {

    itemDetails: ItemDetails[];
    labor: Labor;
    materials: Materials;
    estimate: Estimate;

    constructor(itemDetails: ItemDetails[], labor: Labor, materials: Materials, estimate: Estimate) {
        this.itemDetails = itemDetails;
        this.labor = labor;
        this.materials = materials;
        this.estimate = estimate;
    }
}
