let casual = require('casual');
let fs = require('fs');

let category = ['fixture', 'appliance', 'finish'];
let room = ['bath', 'living', 'kitchen'];
let finishType = ['flooring', 'walls', 'trim', 'windows', 'doors', 'shelving', 'cabnetry'];
let fixtureTypeBath = ['tub', 'shower', 'toilet', 'sink'];
let fixtureTypeKitchen = ['sink'];
let fixtureType = ['fan', 'outlet', 'lighting'];
let applianceTypeKitchen = ['dishwasher', 'stove', 'microwave', 'disposal'];
let applianceTypeLiving = ['fireplace'];
let applianceType = ['refrigerator'];

let roomProvider = {
    rooms: function () {
        let rooms = [];
        let count = casual.integer(from = 1, to = 3);
        for (let i = 0; i < count; i++) {
            let newRoom = casual.random_element(room);
            while (rooms.includes(newRoom)) {
                newRoom = casual.random_element(room);
            }
            rooms.push(newRoom);

        }
        return rooms;
    }
}


casual.register_provider(roomProvider);


casual.define('item', function (id) {

    let item = {
        id: id,
        name: casual.title,
        room: casual.rooms,
        category: casual.random_element(category),
        room: casual.rooms,
        type: null,
        price: null
    }

    // bathrooms don't need appliances
    while (item.room.includes('bath') && item.category === 'appliance') {
        item.category = casual.random_element(category);
    }

    if (item.category === 'finish') {

        item.type = casual.random_element(finishType);
        item.price = casual.integer(min = 5, max = 20);

    } else if (item.category === 'fixture') {

        let fixtureList = fixtureType;
        for(let i = 0; i < item.room.length; i++) {
            if(item.room[i] === 'living') {
                fixtureList.concat(fixtureTypeKitchen);
            } else if(item.room[i] === 'bath') {
                fixtureList.concat(fixtureTypeBath)
            }
        }

        item.type = casual.random_element(fixtureList);
        item.price = casual.integer(min = 60, max = 200);

    } else { // appliance
        let applianceList = applianceType;

        for(let i = 0; i < item.room.length; i++) {
            if(item.room[i] === 'kitchen') {
                applianceList.concat(applianceTypeKitchen);
            } else if(item.room[i] === 'living') {
                applianceList.concat(applianceTypeLiving);
            }
        }

        item.type = casual.random_element(applianceList);
        item.price = casual.integer(min = 600, max = 1600);
    }

    return item;
});

let itemArray = [];

for(let i = 0; i < itemArray.length; i++) {
    for(let key in itemArray[i]) {
        if(itemArray[i].key === null) {
            console.log("something broke!");
        }
    }
}

for (let i = 0; i < 100; i++) {
    itemArray.push(casual.item(i + 1));
}

fs.appendFile('items.json', JSON.stringify(itemArray), function (err) {
    if (err) throw err;
    console.log('Saved!');
});