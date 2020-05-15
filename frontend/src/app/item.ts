
export class Item {
    id: number;
    name: string;
    room: string[];
    category: string;
    type: string;
    price: number;

    constructor(id: number, name: string, room: string[], category: string, type: string, price: number) {
        this.id = id;
        this.name = name;
        this.room = room;
        this.category = category;
        this.type = type;
        this.price = price;
    }
    
}