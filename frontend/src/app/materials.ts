
export class Materials {

    needPlumbingSystem: boolean;
    needElectricalSystem: boolean;
    needFraming: boolean;
    needDrywall: boolean;

    constructor(needPlumbingSystem: boolean, needElectricalSystem: boolean, needFraming: boolean, needDrywall: boolean) {
        this.needPlumbingSystem = false;
        this.needElectricalSystem = false;
        this.needFraming = false;
        this.needDrywall = false;
    }

}
