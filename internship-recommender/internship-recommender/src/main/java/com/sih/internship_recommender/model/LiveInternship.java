package com.sih.internship_recommender.model;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LiveInternship {
    private String jobId;
    private String jobTitle;
    private String employerName;
    private String employerWebsite;
    private String jobPublisher;
    private String jobEmploymentType;
    private String jobDescription;
    private List<ApplyOption> applyOptions;
}
