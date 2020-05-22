
export class Labor {

    id: number;
    needPlumbingSub: boolean;
    needElectricalSub: boolean;
    needRoughCarpentry: boolean;
    needFinishWork: boolean;

    constructor() {
        this.needPlumbingSub = false;
        this.needElectricalSub = false;
        this.needRoughCarpentry = false;
        this.needFinishWork = false;
    }

}
