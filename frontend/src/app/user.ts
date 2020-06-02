import { HomeDetails } from 'src/app/home-details';
import { Project } from 'src/app/project';

export class User {

    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    homeDetails: HomeDetails;
    projects: Project[];

    constructor (firstName: string, lastName: string, email: string, password: string, homeDetails: HomeDetails, projects: Project[]) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.homeDetails = homeDetails;
        this.projects = projects;
    }

}
