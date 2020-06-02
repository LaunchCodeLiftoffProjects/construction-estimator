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

import javax.validation.constraints.NotNull;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import static org.springframework.web.bind.annotation.RequestMethod.*;

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

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getProjects(@RequestParam @NotNull int userId, @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");

        // TODO: maybe re-write this to not include the @RequestParam,
        //  it the check vs the token is unnecessary because we should be trusting the token just
        //  pulling the username from headers should be good enough
        if (userAuthService.doesUserMatch(userId, headerAuth)) {
            return new ResponseEntity<>(projectRepository.findByUserId(userId), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    }

    @GetMapping("/{projectId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getProjectById(@PathVariable("projectId") int projectId,
                                            @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        Optional<Project> projectOptional = projectRepository.findById(projectId);

        // make sure the project exists
        if (projectOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // returns 404 if id does not exist in database
        } else {
            int userId = projectOptional.get().getUser().getId();
            // checks to see if the project requested belongs to the user
            if (userAuthService.doesUserMatch(userId, headerAuth)) {
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

        if (userName != null && userOptional.isPresent()) {

            User user = userOptional.get();
            project.setUser(user);
            projectRepository.save(project);

            int id = project.getId();
            Map<String, String> map = Collections.singletonMap("id", Integer.toString(id));
            return new ResponseEntity<>(map, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
    }

    @PutMapping("{/projectId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateProjectById(@RequestBody Project project, @PathVariable("projectId") int projectId,
                                             @RequestHeader HttpHeaders headers) {

        String headerAuth = headers.getFirst("Authorization");
        Optional<Project> projectOptional = projectRepository.findById(projectId);

        if (projectOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else if (userAuthService.doesUserMatch(projectOptional.get().getUser().getId(), headerAuth)
                && projectOptional.get().getId() == project.getId()) {

            projectRepository.save(project);

            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
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
        } else if (userAuthService.doesUserMatch(projectOptional.get().getUser().getId(), headerAuth)) {
//            // Need to delete all ItemDetails entities associated with project
//            // TODO: once merged, have this delete Materials and Labor entities as well
//            for (ItemDetails itemDetails : project.getItemDetails()) {
//                itemDetailsRepository.deleteById(itemDetails.getId());
//            }


            // lastly delete the project
            projectRepository.deleteById(projectId);

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Best practice response code I think
        } else {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

    }

}