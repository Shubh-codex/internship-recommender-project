package com.sih.internship_recommender.Controller;

import com.sih.internship_recommender.Repository.InternshipRepository;
import com.sih.internship_recommender.model.Internship;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@CrossOrigin(origins = "http://localhost:5173")
public class InternshipController {

    @Autowired
    private InternshipRepository internshipRepository;

    @GetMapping("/search")
    public List<Internship> searchInternships(
            @RequestParam(required = false) String skills,
            @RequestParam(required = false) String fresher_friendly
    ) {
        String[] skillArray = skills != null ? skills.split(",") : new String[0];

        // Prepare skill parameters for repository query
        String skill1 = skillArray.length > 0 ? "," + skillArray[0].trim().toLowerCase() + "," : null;
        String skill2 = skillArray.length > 1 ? "," + skillArray[1].trim().toLowerCase() + "," : null;
        String skill3 = skillArray.length > 2 ? "," + skillArray[2].trim().toLowerCase() + "," : null;

        // Convert fresher-friendly param to lower-case if provided
        String fresherParam = fresher_friendly != null ? fresher_friendly.toLowerCase() : null;

        return internshipRepository.searchBySkillsAndFresher(skill1, skill2, skill3, fresherParam);
    }
}
