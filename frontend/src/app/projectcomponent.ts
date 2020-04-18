import { Item } from './item';
import { Project } from './project';

export class ProjectComponent {
    id: number;
    project: Project;
    item: Item;
    quantity: number;
    finalPrice: number;


    constructor(project: Project, item: Item, quantity: number, finalPrice: number) {
        this.project = project;
        this.item = item;
        this.quantity = quantity;
        this.finalPrice = finalPrice;
    }

}