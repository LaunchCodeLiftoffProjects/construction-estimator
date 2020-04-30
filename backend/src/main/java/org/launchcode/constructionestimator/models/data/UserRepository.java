package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
}
