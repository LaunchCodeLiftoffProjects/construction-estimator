package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.data.EstimateRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
//
@RestController
@RequestMapping("api/project/{id}")
public class EstimateController {
    @Autowired
    EstimateRepository estimateRepository;
}
