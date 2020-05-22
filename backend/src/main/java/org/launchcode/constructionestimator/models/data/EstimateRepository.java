package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.Estimate;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstimateRepository extends CrudRepository<Estimate, Integer> {
}
