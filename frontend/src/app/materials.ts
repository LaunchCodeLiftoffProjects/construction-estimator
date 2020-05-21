
export class Materials {

    id: number;
    needPlumbingSystem: boolean;
    needElectricalSystem: boolean;
    needFraming: boolean;
    needDrywall: boolean;

    constructor() {
        this.needPlumbingSystem = false;
        this.needElectricalSystem = false;
        this.needFraming = false;
        this.needDrywall = false;
    }

}
