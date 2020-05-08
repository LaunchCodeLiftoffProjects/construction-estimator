
export class Materials {

    needPlumbingSystem: boolean;
    needElectricalSystem: boolean;
    needFraming: boolean;
    needDrywall: boolean;

    constructor(needPlumbingSystem: boolean, needElectricalSystem: boolean, needFraming: boolean, needDrywall: boolean) {
        this.needPlumbingSystem = needPlumbingSystem;
        this.needElectricalSystem = needElectricalSystem;
        this.needFraming = needFraming;
        this.needDrywall = needDrywall;
    }

}
