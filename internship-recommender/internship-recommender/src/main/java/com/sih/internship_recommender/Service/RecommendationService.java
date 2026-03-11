package com.sih.internship_recommender.Service;

import com.sih.internship_recommender.model.Candidate;
import com.sih.internship_recommender.model.Internship;
import com.sih.internship_recommender.Repository.InternshipRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final InternshipRepository repository;

    public RecommendationService(InternshipRepository repository) {
        this.repository = repository;
    }

    // Calculate recommendation score
    private double calculateScore(Candidate candidate, Internship internship) {
        Set<String> candidateSkills = candidate.getSkills().stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        Set<String> internshipSkills = Arrays.stream(internship.getRequiredSkills().split(","))
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        // Skill match ratio
        double skillMatch = internshipSkills.isEmpty() ? 0 :
                (double) candidateSkills.stream().filter(internshipSkills::contains).count() / internshipSkills.size();

        // Interest & sector match
        boolean sectorMatch = candidate.getInterests().stream()
                .map(String::toLowerCase)
                .anyMatch(i -> i.equals(internship.getSector().toLowerCase()));

        // Location match
        boolean locationMatch = internship.getLocation().equalsIgnoreCase("remote")
                || internship.getLocation().equalsIgnoreCase(candidate.getLocation());

        // Fresher bonus
        boolean fresherFriendly = internship.getFresherFriendly().equalsIgnoreCase("yes");

        return (0.5 * skillMatch)
                + (0.2 * (sectorMatch ? 1 : 0))
                + (0.2 * (locationMatch ? 1 : 0))
                + (0.1 * (fresherFriendly ? 1 : 0));
    }

    // Get top 5 recommended internships
    public List<Map<String, Object>> recommendInternships(Candidate candidate) {
        List<Internship> internships = repository.findAll();

        // Map each internship with its score
        return internships.stream()
                .map(i -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("internship", i);
                    map.put("score", calculateScore(candidate, i));
                    return map;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("score"), (Double) a.get("score")))
                .limit(5)
                .collect(Collectors.toList());
    }
}
