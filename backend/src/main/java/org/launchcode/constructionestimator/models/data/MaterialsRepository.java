package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.Materials;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialsRepository extends CrudRepository<Materials, Integer> {
}
