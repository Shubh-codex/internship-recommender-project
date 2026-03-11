package com.sih.internship_recommender.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.util.*;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"},
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class SkillRoadmapController {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/roadmap")
    public ResponseEntity<Map<String, Object>> generateRoadmap(@RequestParam String role) {
        Map<String, Object> responseMap = new HashMap<>();

        try {
            // Validate API key
            if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
                responseMap.put("success", false);
                responseMap.put("error", "Gemini API key is not configured. Please set gemini.api.key in application.properties");
                responseMap.put("role", role);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
            }

            // Validate role parameter
            if (role == null || role.trim().isEmpty()) {
                responseMap.put("success", false);
                responseMap.put("error", "Role parameter is required");
                return ResponseEntity.badRequest().body(responseMap);
            }

            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + geminiApiKey.trim();

            // Create a more detailed prompt for better roadmap generation
            String prompt = String.format(
                    "Create a comprehensive learning roadmap for becoming a %s. " +
                            "Include the following sections:\n" +
                            "1. PREREQUISITES: Basic skills needed to start\n" +
                            "2. CORE SKILLS: Essential technical skills to master\n" +
                            "3. LEARNING PATH: Step-by-step progression (Beginner → Intermediate → Advanced)\n" +
                            "4. RECOMMENDED TIMELINE: How long each phase should take\n" +
                            "5. PRACTICAL PROJECTS: Hands-on projects to build\n" +
                            "6. CERTIFICATIONS: Valuable certifications to pursue\n" +
                            "7. CAREER TIPS: Industry insights and advice\n\n" +
                            "Format the response in a clear, structured manner with bullet points and subsections. " +
                            "Make it practical and actionable for someone starting their career journey.",
                    role.trim()
            );

            // Build request body according to Gemini API format
            Map<String, Object> part = new HashMap<>();
            part.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", Collections.singletonList(part));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", Collections.singletonList(content));

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "InternMatch-SkillBuilder/1.0");

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call Gemini API with better error handling
            ResponseEntity<Map> response;
            try {
                response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            } catch (HttpClientErrorException e) {
                String errorMessage = "Gemini API client error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
                responseMap.put("success", false);
                responseMap.put("error", errorMessage);
                responseMap.put("role", role);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
            } catch (HttpServerErrorException e) {
                String errorMessage = "Gemini API server error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
                responseMap.put("success", false);
                responseMap.put("error", errorMessage);
                responseMap.put("role", role);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
            } catch (ResourceAccessException e) {
                String errorMessage = "Network error connecting to Gemini API: " + e.getMessage();
                responseMap.put("success", false);
                responseMap.put("error", errorMessage);
                responseMap.put("role", role);
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(responseMap);
            }

            // Extract text from response
            String roadmapText = "";
            if (response.getBody() != null && response.getBody().containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> firstCandidate = candidates.get(0);
                    if (firstCandidate.containsKey("content")) {
                        Map<String, Object> content1 = (Map<String, Object>) firstCandidate.get("content");
                        if (content1.containsKey("parts")) {
                            List<Map<String, Object>> parts = (List<Map<String, Object>>) content1.get("parts");
                            if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                                roadmapText = parts.get(0).get("text").toString();
                            }
                        }
                    }
                }
            }

            if (roadmapText.trim().isEmpty()) {
                responseMap.put("success", false);
                responseMap.put("error", "No roadmap content received from Gemini API");
                responseMap.put("role", role);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
            }

            // Create successful response object
            responseMap.put("success", true);
            responseMap.put("role", role);
            responseMap.put("roadmap", roadmapText);
            responseMap.put("generatedAt", new Date());

            return ResponseEntity.ok(responseMap);

        } catch (Exception e) {
            e.printStackTrace();

            // Return error response
            responseMap.put("success", false);
            responseMap.put("error", "Unexpected error: " + e.getMessage());
            responseMap.put("role", role);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }

    @GetMapping("/courses")
    public ResponseEntity<Map<String, Object>> getRecommendedCourses(@RequestParam String role) {
        try {
            // Validate role parameter
            if (role == null || role.trim().isEmpty()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Role parameter is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Generate mock course recommendations based on role
            List<Map<String, Object>> courses = generateMockCourses(role.trim());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("role", role);
            response.put("courses", courses);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to generate course recommendations: " + e.getMessage());
            errorResponse.put("role", role);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("timestamp", new Date());
        response.put("service", "SkillRoadmap API");
        return ResponseEntity.ok(response);
    }

    private List<Map<String, Object>> generateMockCourses(String role) {
        List<Map<String, Object>> courses = new ArrayList<>();
        String roleLower = role.toLowerCase();

        // Role-specific course recommendations
        if (roleLower.contains("developer") || roleLower.contains("programming") || roleLower.contains("software")) {
            courses.add(createCourse("Complete Web Development Bootcamp", "Coursera", 4.8f, "120K+", "12 weeks", "$49", "https://coursera.org"));
            courses.add(createCourse("JavaScript Fundamentals", "Udemy", 4.7f, "85K+", "8 weeks", "$39", "https://udemy.com"));
            courses.add(createCourse("React Developer Course", "edX", 4.9f, "95K+", "10 weeks", "$59", "https://edx.org"));
        } else if (roleLower.contains("data") || roleLower.contains("analytics") || roleLower.contains("scientist")) {
            courses.add(createCourse("Data Science Fundamentals", "Coursera", 4.8f, "150K+", "16 weeks", "$79", "https://coursera.org"));
            courses.add(createCourse("Machine Learning A-Z", "Udemy", 4.9f, "200K+", "20 weeks", "$69", "https://udemy.com"));
            courses.add(createCourse("Python for Data Analysis", "edX", 4.7f, "110K+", "12 weeks", "$49", "https://edx.org"));
        } else if (roleLower.contains("design") || roleLower.contains("ui") || roleLower.contains("ux")) {
            courses.add(createCourse("UI/UX Design Masterclass", "Coursera", 4.8f, "90K+", "14 weeks", "$59", "https://coursera.org"));
            courses.add(createCourse("Adobe Creative Suite", "Udemy", 4.6f, "75K+", "10 weeks", "$45", "https://udemy.com"));
            courses.add(createCourse("Design Thinking Workshop", "edX", 4.7f, "60K+", "8 weeks", "$39", "https://edx.org"));
        } else if (roleLower.contains("marketing") || roleLower.contains("digital")) {
            courses.add(createCourse("Digital Marketing Strategy", "Coursera", 4.7f, "100K+", "12 weeks", "$55", "https://coursera.org"));
            courses.add(createCourse("Social Media Marketing", "Udemy", 4.5f, "80K+", "8 weeks", "$35", "https://udemy.com"));
            courses.add(createCourse("Google Ads Certification", "edX", 4.8f, "70K+", "6 weeks", "$29", "https://edx.org"));
        } else {
            // Generic courses for other roles
            courses.add(createCourse("Professional Skills Development", "Coursera", 4.6f, "75K+", "8 weeks", "$39", "https://coursera.org"));
            courses.add(createCourse("Industry Fundamentals", "Udemy", 4.5f, "50K+", "6 weeks", "$29", "https://udemy.com"));
            courses.add(createCourse("Career Advancement Course", "edX", 4.7f, "80K+", "10 weeks", "$49", "https://edx.org"));
        }

        return courses;
    }

    private Map<String, Object> createCourse(String title, String provider, float rating,
                                             String students, String duration, String price, String baseUrl) {
        Map<String, Object> course = new HashMap<>();
        course.put("title", title);
        course.put("provider", provider);
        course.put("rating", rating);
        course.put("students", students);
        course.put("duration", duration);
        course.put("price", price);
        course.put("link", baseUrl);
        return course;
    }
}