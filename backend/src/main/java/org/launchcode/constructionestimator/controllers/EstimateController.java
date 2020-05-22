package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.data.ItemRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/project/{id}")
public class EstimateController {
    @Autowired
    ItemRepository itemRepository;
}
