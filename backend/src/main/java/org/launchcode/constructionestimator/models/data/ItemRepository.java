package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.Item;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends CrudRepository<Item, Integer> {

    // Search repository by category
    List<Item> findByCategory(String category);
}
