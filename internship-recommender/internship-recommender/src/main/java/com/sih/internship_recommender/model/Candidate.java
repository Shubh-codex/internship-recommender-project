package com.sih.internship_recommender.model;

import lombok.Data;
import java.util.List;

@Data
public class Candidate {
    private List<String> skills;
    private List<String> interests;
    private String location;
}
