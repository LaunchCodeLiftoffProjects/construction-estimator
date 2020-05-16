package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.ItemDetails;
import org.launchcode.constructionestimator.models.Project;
import org.launchcode.constructionestimator.models.User;
import org.launchcode.constructionestimator.models.data.ItemDetailsRepository;
import org.launchcode.constructionestimator.models.data.ProjectRepository;
import org.launchcode.constructionestimator.models.data.UserRepository;
import org.launchcode.constructionestimator.security.services.UserAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ItemDetailsRepository itemDetailsRepository;

    @Autowired
    UserAuthService userAuthService;
  
    // Use this with @RequestParam to search all projects by field, leave params empty to return all projects
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getProjects(@RequestParam int userId, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        if(userAuthService.doesUserMatch(userId, headerAuth)) {
            if (projectRepository.findByUserId(userId).isPresent()) {
                // TODO: Test the crap out of this. I don't think it returns a complete list
                return new ResponseEntity<>(projectRepository.findByUserId(userId).get(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }


    }

    @GetMapping("/{projectId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getProjectById(@PathVariable("projectId") int projectId, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        Optional<Project> projectOptional = projectRepository.findById(projectId);

        // make sure the project exists
        if (projectOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // returns 404 if id does not exist in database
        } else {
            int userId = projectOptional.get().getUser().getId();
            // checks to see if the project requested belongs to the user
            if(userAuthService.doesUserMatch(userId, headerAuth)) {
                return new ResponseEntity<>(projectOptional.get(), HttpStatus.OK);
            }
        }

        // Returns 401 if user attempts to access another user's project
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    // Returns json in form { 'id': project.id }
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> postProject(@RequestBody Project project, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        String userName = userAuthService.getUserName(headerAuth);
        Optional<User> userOptional = userRepository.findByName(userName);

        if(userName != null && userOptional.isPresent()) {

            User user = userOptional.get();
            project.setUser(user);
            projectRepository.save(project);

            int id = project.getId();
            Map<String, String> map = Collections.singletonMap("id", Integer.toString(id));
            return new ResponseEntity<>(map, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    // returns json in form { "id": "project.id" }
    // this is probably unnecessary but left it for consistency with the post mapping
    @PutMapping("/{projectId}")
    @PreAuthorize("HasRole('USER')")
    public ResponseEntity<?> updateProject(@PathVariable("projectId") int projectId, @RequestBody Project project,
                                           @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        Optional<Project> projectOptional = projectRepository.findById(projectId);

        // return 404 if project doesn't already exist
        if (projectOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(projectOptional.get().getUser().getId(), headerAuth)) {
            projectRepository.save(project); // save the updated project

            Map<String, String> map = Collections.singletonMap("id", Integer.toString(projectId));
            return new ResponseEntity<>(map, HttpStatus.OK);
        } else {
            // returns 401 if user attempts to access wrong project
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    }

    @DeleteMapping("/{projectId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteProject(@PathVariable("projectId") int projectId,
                                           @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        Optional<Project> projectOptional = projectRepository.findById(projectId);

        // Check and see if project exists
        if (projectOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if(userAuthService.doesUserMatch(projectOptional.get().getUser().getId(), headerAuth)) {
            Project project = projectOptional.get();

            // Need to delete all ItemDetails entities associated with project
            // TODO: once merged, have this delete Materials and Labor entities as well
            for (ItemDetails itemDetails : project.getItemDetails()) {
                itemDetailsRepository.deleteById(itemDetails.getId());
            }

            // lastly delete the project
            projectRepository.deleteById(projectId);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Best practice response code I think
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    }

}