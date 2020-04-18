package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.Project;
import org.launchcode.constructionestimator.models.ItemDetails;
import org.launchcode.constructionestimator.models.data.ItemDetailsRepository;
import org.launchcode.constructionestimator.models.data.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project/{projectId}/component")
public class ItemDetailsController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ItemDetailsRepository itemDetailsRepository;

    // Add a list of components
    @PostMapping
    public ResponseEntity postProjectComponents(@RequestBody List<ItemDetails> components, @PathVariable("projectId") int projectId) {

        if(projectRepository.findById(projectId).isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {
            Project project = projectRepository.findById(projectId).get();
            itemDetailsRepository.saveAll(components);
            project.setItemDetails(components);
            projectRepository.save(project);
            return new ResponseEntity(HttpStatus.CREATED);
        }
    }
}
