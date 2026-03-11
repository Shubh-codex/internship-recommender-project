package com.sih.internship_recommender.Repository;

import com.sih.internship_recommender.model.Internship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {

    @Query("SELECT i FROM Internship i " +
            "WHERE (:fresherFriendly IS NULL OR LOWER(i.fresherFriendly) = LOWER(:fresherFriendly)) " +
            "AND (" +
            "   (:skill1 IS NULL OR CONCAT(',', LOWER(i.requiredSkills), ',') LIKE %:skill1%) " +
            "   OR (:skill2 IS NOT NULL AND CONCAT(',', LOWER(i.requiredSkills), ',') LIKE %:skill2%) " +
            "   OR (:skill3 IS NOT NULL AND CONCAT(',', LOWER(i.requiredSkills), ',') LIKE %:skill3%)" +
            ")")
    List<Internship> searchBySkillsAndFresher(
            @Param("skill1") String skill1,
            @Param("skill2") String skill2,
            @Param("skill3") String skill3,
            @Param("fresherFriendly") String fresherFriendly
    );
}
