
export class Labor {

    needPlumbingSub: boolean;
    needElectricalSub: boolean;
    needRoughCarpentry: boolean;
    needFinishWork: boolean;

    constructor(needPlumbingSub: boolean, needElectricalSub: boolean, needRoughCarpentry: boolean, needFinishWork: boolean) {
        this.needPlumbingSub = needPlumbingSub;
        this.needElectricalSub = needElectricalSub;
        this.needRoughCarpentry = needRoughCarpentry;
        this.needFinishWork = needFinishWork;
    }

}
