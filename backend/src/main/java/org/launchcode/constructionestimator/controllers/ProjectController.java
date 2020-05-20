package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.ItemDetails;
import org.launchcode.constructionestimator.models.Project;
import org.launchcode.constructionestimator.models.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/project")
public class ProjectController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ItemDetailsRepository itemDetailsRepository;

    @Autowired
    MaterialsRepository materialsRepository;

    @Autowired
    LaborRepository laborRepository;

    @Autowired
    EstimateRepository estimateRepository;

    // Use this with @RequestParam to search all projects by field, leave params empty to return all projects
    @GetMapping
    public ResponseEntity getProjects() {

        return new ResponseEntity(projectRepository.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity getProjectById(@PathVariable("projectId") int projectId) {
        if (projectRepository.findById(projectId).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND); // returns 404 if id does not exist in database
        } else {
            return new ResponseEntity(projectRepository.findById(projectId), HttpStatus.OK);
        }
    }

    // Returns json in form { 'id': project.id }
    @PostMapping
    public ResponseEntity postProject(@RequestBody Project project) {

        projectRepository.save(project);

        Integer id = project.getId();
        Map<String, String> map = Collections.singletonMap("id", id.toString());
        return new ResponseEntity(map, HttpStatus.CREATED);
    }

    // returns json in form { "id": "project.id" }
    // this is probably unnecessary but left it for consistency with the post mapping
    @PutMapping("/{projectId}")
    public ResponseEntity updateProject(@PathVariable("projectId") int projectId, @RequestBody Project project) {

        // return 404 if project doesn't already exist
        if (projectRepository.findById(projectId).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            projectRepository.save(project);

            //TODO: Check this as well

            Integer id = projectId;
            Map<String, String> map = Collections.singletonMap("id", id.toString());
            return new ResponseEntity(map, HttpStatus.OK);
        }

    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity deleteProject(@PathVariable("projectId") int projectId) {

        // Check and see if project exists
        if (projectRepository.findById(projectId).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            Project project = projectRepository.findById(projectId).get();

            // Need to delete all ItemDetails entities associated with project
            for (ItemDetails itemDetails : project.getItemDetails()) {
                itemDetailsRepository.deleteById(itemDetails.getId());
            }

            //TODO: Delete Labor and Materials entities

            // lastly delete the project
            projectRepository.deleteById(projectId);

            return new ResponseEntity(HttpStatus.NO_CONTENT);  // Best practice response code I think
        }

    }

}