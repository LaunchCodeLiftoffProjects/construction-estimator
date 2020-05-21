export class Estimate {

    id: number;
    appliancesCost: number;
    fixturesCost: number;
    finishesCost: number;
    materialsCost: number;
    laborCost: number;
    totalCost: number;

    constructor() {
        this.appliancesCost = 0;
        this.fixturesCost = 0;
        this.finishesCost = 0;
        this.materialsCost = 0;
        this.laborCost = 0;
        this.totalCost = 0;
    }

}
