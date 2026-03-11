package com.sih.internship_recommender.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sih.internship_recommender.model.ApplyOption;
import com.sih.internship_recommender.model.LiveInternship;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LiveInternshipService {

    @Value("${jsearch.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Fetch live internships from API and filter based on candidate input.
     *
     * @param query      Job query, e.g., "java developer"
     * @param location   Job location filter, e.g., "India"
     * @param page       API pagination page
     * @param numPages   Number of pages to fetch
     * @param skills     Candidate skills to filter jobs
     * @param employmentTypes Filter by employment type (Full-time, Part-time, etc.)
     * @return List of LiveInternship matching filters
     */
    public List<LiveInternship> searchLiveInternships(
            String query,
            String location,
            int page,
            int numPages,
            List<String> skills,
            List<String> employmentTypes
    ) {
        String url = String.format(
                "https://jsearch.p.rapidapi.com/search?query=%s in %s&page=%d&num_pages=%d",
                query, location, page, numPages
        );

        try {
            // Setup headers
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("X-RapidAPI-Key", apiKey);
            headers.set("X-RapidAPI-Host", "jsearch.p.rapidapi.com");
            org.springframework.http.HttpEntity<Void> requestEntity = new org.springframework.http.HttpEntity<>(headers);

            // Call API
            org.springframework.http.ResponseEntity<String> response =
                    restTemplate.exchange(url, org.springframework.http.HttpMethod.GET, requestEntity, String.class);

            String body = response.getBody();
            JsonNode rootNode = objectMapper.readTree(body);
            JsonNode dataNode = rootNode.path("data");

            List<LiveInternship> liveInternships = new ArrayList<>();

            if (dataNode.isArray()) {
                for (JsonNode jobNode : dataNode) {
                    LiveInternship job = new LiveInternship();
                    job.setJobId(jobNode.path("job_id").asText());
                    job.setJobTitle(jobNode.path("job_title").asText());
                    job.setEmployerName(jobNode.path("employer_name").asText());
                    job.setEmployerWebsite(jobNode.path("employer_website").asText(null));
                    job.setJobPublisher(jobNode.path("job_publisher").asText());
                    job.setJobEmploymentType(jobNode.path("job_employment_type").asText());
                    job.setJobDescription(jobNode.path("job_description").asText());

                    // Parse apply options
                    List<ApplyOption> applyOptions = new ArrayList<>();
                    JsonNode applyOptionsNode = jobNode.path("apply_options");
                    if (applyOptionsNode.isArray()) {
                        for (JsonNode optionNode : applyOptionsNode) {
                            ApplyOption option = new ApplyOption();
                            option.setPublisher(optionNode.path("publisher").asText());
                            option.setApplyLink(optionNode.path("apply_link").asText());
                            option.setDirect(optionNode.path("is_direct").asBoolean());
                            applyOptions.add(option);
                        }
                    }
                    job.setApplyOptions(applyOptions);

                    liveInternships.add(job);
                }
            }

            // 1️⃣ Filter by skills (jobTitle or jobDescription)
            if (skills != null && !skills.isEmpty()) {
                liveInternships = liveInternships.stream()
                        .filter(job -> skills.stream()
                                .anyMatch(skill -> job.getJobTitle().toLowerCase().contains(skill.toLowerCase())
                                        || job.getJobDescription().toLowerCase().contains(skill.toLowerCase())))
                        .collect(Collectors.toList());
            }

            // 2️⃣ Filter by employment type
            if (employmentTypes != null && !employmentTypes.isEmpty()) {
                liveInternships = liveInternships.stream()
                        .filter(job -> employmentTypes.stream()
                                .anyMatch(type -> job.getJobEmploymentType().equalsIgnoreCase(type)))
                        .collect(Collectors.toList());
            }

            // 3️⃣ Limit response to first 10–20 jobs for frontend
            int maxResults = 20;
            if (liveInternships.size() > maxResults) {
                liveInternships = liveInternships.subList(0, maxResults);
            }

            return liveInternships;

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
