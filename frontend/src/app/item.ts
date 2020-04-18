import { ProjectComponent } from './projectcomponent';

export class Item {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;

    //Do we need this on the frontend?
    projectComponents: ProjectComponent[];

    constructor(id: number, name: string, description: string, price: number, category: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.category = category;
    }
    
}