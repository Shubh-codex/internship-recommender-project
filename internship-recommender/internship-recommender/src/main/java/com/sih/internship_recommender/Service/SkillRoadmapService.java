package com.sih.internship_recommender.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class SkillRoadmapService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public String generateRoadmap(String role) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            // Headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-goog-api-key", apiKey);

            // Request Body
            Map<String, Object> part = new HashMap<>();
            part.put("text", "Create a detailed learning roadmap for becoming a " + role);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(content));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call Gemini API
            Map<String, Object> response = restTemplate.postForObject(apiUrl, entity, Map.class);

            // Parse response
            String roadmap = "";
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    if (firstCandidate.containsKey("content")) {
                        Map<String, Object> content1 = (Map<String, Object>) firstCandidate.get("content");
                        if (content1.containsKey("parts")) {
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content1.get("parts");
                            if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                                roadmap = parts.get(0).get("text").toString();
                            }
                        }
                    }
                }
            }

            return roadmap.isEmpty() ? "No roadmap generated." : roadmap;

        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to generate roadmap: " + e.getMessage();
        }
    }
}
