import { ItemDetails } from './item-details';

export class Project {

    id: number;
    name: string;
    roomType: string;
    roomLength: number;
    roomWidth: number;
    roomHeight: number;
    itemDetails: ItemDetails[];
    finalCost?: number;

    constructor(name: string, roomType: string, roomLength: number, roomWidth: number, roomHeight: number, itemDetails?: ItemDetails[]) {
        this.name = name;
        this.roomType = roomType;
        this.roomLength = roomLength;
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        this.itemDetails = [];

        this.finalCost = this.calculateTotalCost();
    }

    addItemDetails(itemDetails: ItemDetails) {
        this.itemDetails.push(itemDetails);
        this.finalCost = this.calculateTotalCost();
    }

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