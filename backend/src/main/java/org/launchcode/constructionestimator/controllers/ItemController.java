package org.launchcode.constructionestimator.controllers;

import org.launchcode.constructionestimator.models.data.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/item")
public class ItemController {




//    @Autowired
//    ItemRepository itemRepository;
//
//    @GetMapping
//    public ResponseEntity getItems(@RequestParam Optional<String> category) {
//
//        if(category.isPresent()) {
//            return new ResponseEntity(itemRepository.findByCategory(category.get()), HttpStatus.OK);
//        }
//        return new ResponseEntity(itemRepository.findAll(), HttpStatus.OK);
//    }
//
//    @GetMapping("/{itemId}")
//    public ResponseEntity getItemById(@PathVariable int itemId) {
//        if(itemRepository.findById(itemId).isEmpty()) {
//            return new ResponseEntity(HttpStatus.NOT_FOUND);
//        } else {
//            return new ResponseEntity(itemRepository.findById(itemId), HttpStatus.OK);
//        }
//    }
}
