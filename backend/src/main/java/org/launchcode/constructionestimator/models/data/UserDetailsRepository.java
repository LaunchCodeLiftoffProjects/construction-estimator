package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.UserDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepository extends CrudRepository<UserDetails, Integer> {
}
