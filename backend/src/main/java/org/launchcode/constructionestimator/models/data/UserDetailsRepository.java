package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.HomeDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepository extends CrudRepository<HomeDetails, Integer> {
}
