package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.Project;
import org.launchcode.constructionestimator.models.ProjectComponent;
import org.launchcode.constructionestimator.models.data.ProjectComponentRepository;
import org.launchcode.constructionestimator.models.data.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project/{projectId}/component")
public class ProjectComponentController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ProjectComponentRepository projectComponentRepository;

    // Add a list of components
    @PostMapping
    public ResponseEntity postProjectComponents(@RequestBody List<ProjectComponent> components, @PathVariable("projectId") int projectId) {

        if(projectRepository.findById(projectId).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            Project project = projectRepository.findById(projectId).get();
            projectComponentRepository.saveAll(components);
            project.setProjectComponents(components);
            projectRepository.save(project);
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }
}
