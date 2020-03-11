package org.launchcode.constructionestimator;

import java.util.ArrayList;

public class ConstructionEstimatorData {

    private static ArrayList<Project> allProjects;
    private static ArrayList<User> allUsers = new ArrayList<>();


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

//    method to find all user objects:
    public static ArrayList<User> findAllUsers() {
        for (Project project : allProjects) {
            User user = project.getProjectOwner();
            if (allUsers.contains(user)) {
                continue;
            } else {
                allUsers.add(user);
            }
        }
        return allUsers;
    }

}
