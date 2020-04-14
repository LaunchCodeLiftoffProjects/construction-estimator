package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.Item;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends CrudRepository<Item, Integer> {
}
