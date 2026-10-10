package com.kunaldange.ems.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmployeeCodeIgnoreCase(String employeeCode);
    Optional<Employee> findByEmailIgnoreCase(String email);
}
