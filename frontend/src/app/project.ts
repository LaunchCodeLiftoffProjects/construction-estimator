import { ItemDetails } from './item-details';
import { Materials } from './materials';
import { Labor } from './labor';

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

    constructor(name: string, roomType: string, roomLength: number, roomWidth: number, roomHeight: number) {
        this.name = name;
        this.roomType = roomType;
        this.roomLength = roomLength;
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
    }

    addItemDetails(itemDetails: ItemDetails) {
        this.itemDetails.push(itemDetails);
    }

    // Returns the index of itemDetails matching itemId, -1 if not found
    findItemDetailsByItemId(itemId: number): number {
        for(let i = 0; i < this.itemDetails.length; i++) {
            if(this.itemDetails[i].itemId === itemId) {
                return i;
            }
        }

        return -1;
    }
}


