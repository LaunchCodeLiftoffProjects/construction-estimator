package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.Project;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface ProjectRepository extends CrudRepository<Project, Integer> {

    Optional<Project> findByUserId(int userId);
}
