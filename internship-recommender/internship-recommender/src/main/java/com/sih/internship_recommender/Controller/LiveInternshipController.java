package com.sih.internship_recommender.Controller;

import com.sih.internship_recommender.model.LiveInternship;
import com.sih.internship_recommender.service.LiveInternshipService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/live-internships")
@CrossOrigin(origins = "http://localhost:5173")
public class LiveInternshipController {

    private final LiveInternshipService liveInternshipService;

    public LiveInternshipController(LiveInternshipService liveInternshipService) {
        this.liveInternshipService = liveInternshipService;
    }

    @GetMapping("/search")
    public List<LiveInternship> searchLiveInternships(
            @RequestParam String query,
            @RequestParam(defaultValue = "India") String location,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int numPages,
            @RequestParam(required = false) List<String> skills,
            @RequestParam(required = false) List<String> employmentTypes
    ) {
        return liveInternshipService.searchLiveInternships(query, location, page, numPages, skills, employmentTypes);
    }
}
