package com.sih.internship_recommender.Controller;

import com.sih.internship_recommender.model.Candidate;
import com.sih.internship_recommender.Service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommend")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final RecommendationService service;

    public RecommendationController(RecommendationService service) {
        this.service = service;
    }

    @PostMapping
    public List<Map<String, Object>> recommendInternships(@RequestBody Candidate candidate) {
        return service.recommendInternships(candidate);
    }
}
