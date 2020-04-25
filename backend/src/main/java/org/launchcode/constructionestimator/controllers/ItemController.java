package org.launchcode.constructionestimator.controllers;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;


@Controller
public class ItemController {

    @GetMapping(value = "/api/item", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody byte[] getAllItems() throws IOException {
        byte[] array = Files.readAllBytes(Paths.get("src/main/resources/items.json"));
        return array;
    }

}
