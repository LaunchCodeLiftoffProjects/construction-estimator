export class UserDetails {

    id: number;
    homeAge: number;
    homeBuild: string; // maybe make this an enum?
    homeNotes: string;

    constructor (homeAge: number, homeBuild: string, homeNotes: string) {
        this.homeAge = homeAge;
        this.homeBuild = homeBuild;
        this.homeNotes = homeNotes;
    }

}
