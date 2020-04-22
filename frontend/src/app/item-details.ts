import { Item } from './item';
import { Project } from './project';

export class ItemDetails {
    project: Project;
    item: Item;
    quantity: number;
    finalPrice: number;


    constructor(project: Project, item: Item) {
        this.project = project;
        this.item = item;
    }

}