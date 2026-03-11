package com.sih.internship_recommender.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "internship")
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String sector;

    @Column(name = "required_skills")
    private String requiredSkills;

    private String location;
    private String duration;

    @Column(name = "fresher_friendly")
    private String fresherFriendly;

    // Getters and Setters
}
