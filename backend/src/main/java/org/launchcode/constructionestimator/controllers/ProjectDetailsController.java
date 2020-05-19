package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.Labor;
import org.launchcode.constructionestimator.models.Materials;
import org.launchcode.constructionestimator.models.Project;
import org.launchcode.constructionestimator.models.ItemDetails;
import org.launchcode.constructionestimator.models.data.ItemDetailsRepository;
import org.launchcode.constructionestimator.models.data.LaborRepository;
import org.launchcode.constructionestimator.models.data.MaterialsRepository;
import org.launchcode.constructionestimator.models.data.ProjectRepository;
import org.launchcode.constructionestimator.payload.request.ProjectDetailsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/project/{projectId}/details")
public class ProjectDetailsController {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    ItemDetailsRepository itemDetailsRepository;

    @Autowired
    MaterialsRepository materialsRepository;

    @Autowired
    LaborRepository laborRepository;

    @PostMapping
    public ResponseEntity postProjectDetails(@RequestBody ProjectDetailsRequest projectDetails,
                                             @PathVariable("projectId") int projectId) {

        Optional<Project> projectOptional = projectRepository.findById(projectId);

        if(projectOptional.isEmpty()) {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        } else {

            // pull out each component from projectDetails request
            Labor labor = projectDetails.getLabor();
            Materials materials = projectDetails.getMaterials();
            List<ItemDetails> itemDetailsList = projectDetails.getItemDetailsList();
            Project project = projectOptional.get();

            // save all individual components
            laborRepository.save(labor);
            materialsRepository.save(materials);
            itemDetailsRepository.saveAll(itemDetailsList);

            // update and save the project to set relations
            project.setItemDetails(itemDetailsList);
            project.setMaterials(materials);
            project.setLabor(labor);
            projectRepository.save(project);

            return new ResponseEntity(HttpStatus.CREATED);

        }
    }
}
