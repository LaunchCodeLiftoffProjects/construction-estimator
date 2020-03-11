package org.launchcode.constructionestimator;

import java.util.ArrayList;

public class ConstructionEstimatorData {

    private static ArrayList<Project> allProjects;
    private static ArrayList<User> allUsers;


//    The REST controller will take POST requests and save new projects / users to the array lists in this Java class!!
//    The only methods in this Java class are those that don't require info from JSON.

//    method to find all project objects for a given user:
    public static ArrayList<Project> getProjectsByUserId(int userId) {
        ArrayList<Project> projectsByUser = new ArrayList<>();
        for (Project project : allProjects) {
            if (project.getProjectOwner().getUserId() == userId) {
                projectsByUser.add(project);
            }
        }
        return projectsByUser;
    }

//    method to find all projects by username:
    public static ArrayList<Project> getProjectsByUsername(String username) {
        ArrayList<Project> projectsByUser = new ArrayList<>();
        for (Project project : allProjects) {
            if (project.getProjectOwner().getName().equals(username)) {
                projectsByUser.add(project);
            }
        }
        return projectsByUser;
    }

}
