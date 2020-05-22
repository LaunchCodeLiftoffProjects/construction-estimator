package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.*;
import org.launchcode.constructionestimator.models.data.*;
import org.launchcode.constructionestimator.payload.request.ProjectDetailsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/project/{projectId}/details")
public class ProjectDetailsController {

    @Autowired
    ProjectRepository projectRepository;

    @PostMapping
    public ResponseEntity postProjectDetails(@RequestBody ProjectDetailsRequest projectDetails,
                                             @PathVariable("projectId") int projectId) {

        Optional<Project> projectOptional = projectRepository.findById(projectId);

        if(projectOptional.isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {

            //TODO: Verify all of this

            // pull out each component from projectDetails request
            Labor labor = projectDetails.getLabor();
            Materials materials = projectDetails.getMaterials();
            List<ItemDetails> itemDetailsList = projectDetails.getItemDetailsList();
            Estimate estimate = projectDetails.getEstimate();
            Project project = projectOptional.get();

            // update and save the project to set relations
            project.setItemDetails(itemDetailsList);
            project.setMaterials(materials);
            materials.setProject(project);
            project.setLabor(labor);
            labor.setProject(project);
            project.setEstimate(estimate);
            estimate.setProject(project);
            projectRepository.save(project);

            return new ResponseEntity(HttpStatus.CREATED);

        }
    }
}
