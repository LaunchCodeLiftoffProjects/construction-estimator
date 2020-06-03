package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.Project;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ProjectRepository extends CrudRepository<Project, Integer> {

    // finds all projects associated with user with id userId
    // TODO: write custom query to return only project name and id
    Optional<Iterable<Project>> findByUserId(int userId);
}
