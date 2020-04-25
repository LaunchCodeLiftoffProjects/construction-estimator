package org.launchcode.constructionestimator.controllers;

import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;


@Controller
//@RequestMapping("/api/item")
public class ItemController {

    @GetMapping(value = "/api/item", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody byte[] getAllItems() throws IOException {
        byte[] array = Files.readAllBytes(Paths.get("src/main/resources/items.json"));
        return array;
    }


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
