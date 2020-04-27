import { UserDetails } from 'src/app/user-details';
import { Project } from 'src/app/project';

export class User {

    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userDetails: UserDetails;
    projects: Project[];

    constructor (firstName: string, lastName: string, email: string, password: string, userDetails: UserDetails, projects: Project[]) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.userDetails = userDetails;
        this.projects = projects;
    }

}
