import { ItemDetails } from './item-details';
import { Materials } from './materials';
import { Labor } from './labor';
import { Estimate } from './estimate';

export class Project {

    id: number;
    name: string;
    roomType: string;
    roomLength: number;
    roomWidth: number;
    roomHeight: number;
    itemDetails: ItemDetails[];
    materials: Materials;
    labor: Labor;
    estimate: Estimate;

    constructor(name: string, roomType: string, roomLength: number, roomWidth: number, roomHeight: number) {
        this.name = name;
        this.roomType = roomType;
        this.roomLength = roomLength;
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        this.itemDetails = [];
        // these are causing problems on backend. Can be undefined for new projects
        // this.materials = new Materials;
        // this.labor = new Labor;
    }

}

