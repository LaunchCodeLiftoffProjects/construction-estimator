
export class Labor {

    needPlumbingSub: boolean;
    needElectricalSub: boolean;
    needRoughCarpentry: boolean;
    needFinishWork: boolean;

    constructor(needPlumbingSub: boolean, needElectricalSub: boolean, needRoughCarpentry: boolean, needFinishWork: boolean) {
        this.needPlumbingSub = false;
        this.needElectricalSub = false;
        this.needRoughCarpentry = false;
        this.needFinishWork = false;
    }

}
