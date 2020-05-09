package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {

    Optional<User> findByName(String email);
}
