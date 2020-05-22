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
<<<<
    materials: Materials;
    labor: Labor;
    
=======
    estimate: Estimate;
>>>>>>> origin/master

    constructor(name: string, roomType: string, roomLength: number, roomWidth: number, roomHeight: number, itemDetails?: ItemDetails[]) {
        this.name = name;
        this.roomType = roomType;
        this.roomLength = roomLength;
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        this.itemDetails = [];
<<<<<<< HEAD
<<<<<<< HEAD
        this.materials = new Materials;
        this.labor = new Labor;
=======
        // these are causing problems on backend. Can be undefined for new projects
        // this.materials = new Materials;
        // this.labor = new Labor;
>>>>>>> origin/master
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