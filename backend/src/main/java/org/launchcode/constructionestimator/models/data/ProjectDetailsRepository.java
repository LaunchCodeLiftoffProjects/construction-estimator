package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.ProjectDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectDetailsRepository extends CrudRepository<ProjectDetails, Integer> {
}
