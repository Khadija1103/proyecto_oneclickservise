package com.oneclickservice.oneclickservicebackend.repository;

import com.oneclickservice.oneclickservicebackend.entity.Postulacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostulacionRepository extends JpaRepository<Postulacion, Long> {
}