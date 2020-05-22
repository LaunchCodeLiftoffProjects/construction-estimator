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
<<<<<<< HEAD
    materials: Materials;
    labor: Labor;
=======
    finalCost?: number;
>>>>>>> 011063221e3b5464afcedf5fa1157053a74335e9

    constructor(name: string, roomType: string, roomLength: number, roomWidth: number, roomHeight: number, itemDetails?: ItemDetails[]) {
        this.name = name;
        this.roomType = roomType;
        this.roomLength = roomLength;
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        this.itemDetails = [];
<<<<<<< HEAD
        this.materials = new Materials;
        this.labor = new Labor;
    }

}
=======

        this.finalCost = this.calculateTotalCost();
    }

    addItemDetails(itemDetails: ItemDetails) {
        this.itemDetails.push(itemDetails);
        this.finalCost = this.calculateTotalCost();
    }
>>>>>>> 011063221e3b5464afcedf5fa1157053a74335e9

    addManyItemDetails(...itemDetails: ItemDetails[]) {
        this.itemDetails.push(itemDetails);
    }

    calculateTotalCost(itemDetails = this.itemDetails): number {
        if(itemDetails && itemDetails.length > 0) {
            return itemDetails.reduce((accumulator, itemIter) => {
                return accumulator + itemIter.quantity * itemIter.finalCost;
            }, 0);
        } else {
            return 0;
        }
    }
}