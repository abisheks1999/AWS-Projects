package net.springboot.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import net.springboot.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{

}
