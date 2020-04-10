package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.ProjectComponent;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectComponentRepository extends CrudRepository<ProjectComponent, Integer> {
}
