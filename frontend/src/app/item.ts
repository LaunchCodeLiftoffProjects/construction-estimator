
export class Item {
    id: number;
    name: string;
    room: string[];
    category: string;
    type: string;
    price: number;
    roughMaterials: number;
    labor: number;

    constructor(id: number, name: string, room: string[], category: string, type: string, price: number, roughMaterials: number, labor: number) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.category = category;
        this.type = type;
        this.price = price;
        this.roughMaterials = roughMaterials;
        this.labor = labor;
    }
    
}