package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.ERole;
import org.launchcode.constructionestimator.models.Role;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RoleRepository extends CrudRepository<Role, Integer> {

    Optional<Role> findByName(ERole name);
}
