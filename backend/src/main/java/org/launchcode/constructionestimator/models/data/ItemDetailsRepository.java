package org.launchcode.constructionestimator.models.data;

import org.launchcode.constructionestimator.models.ItemDetails;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemDetailsRepository extends CrudRepository<ItemDetails, Integer> {
}
