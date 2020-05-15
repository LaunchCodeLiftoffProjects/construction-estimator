export class Estimate {

    id: number;
    projectID: number;
    appliancesCost: number;
    fixturesCost: number;
    finishesCost: number;
    materialsCost: number;
    laborCost: number;
    totalCost: number;

    constructor(id: number, projectID: number, appliancesCost: number, fixturesCost: number, finishesCost: number, materialsCost: number, laborCost: number, totalCost: number) {
        this.id = id;
        this.projectID = projectID;
        this.appliancesCost = appliancesCost;
        this.fixturesCost = fixturesCost;
        this.finishesCost = finishesCost;
        this.materialsCost = materialsCost;
        this.laborCost = laborCost;
        this.totalCost = totalCost;
    }

}
