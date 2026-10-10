package com.kunaldange.ems.employee;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository repository;

    public EmployeeService(EmployeeRepository repository) {
        this.repository = repository;
    }

    public List<Employee> findAll() {
        return repository.findAll();
    }

    public Employee findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Employee not found"));
    }

    public Employee create(EmployeeRequest request) {
        if (repository.existsByEmailIgnoreCase(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }
        if (repository.existsByEmployeeCodeIgnoreCase(request.employeeCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Employee code is already registered");
        }
        return repository.save(map(new Employee(), request));
    }

    public Employee update(Long id, EmployeeRequest request) {
        Employee employee = findById(id);
        repository.findByEmailIgnoreCase(request.email())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered"); });
        if (repository.existsByEmployeeCodeIgnoreCase(request.employeeCode())
                && !employee.getEmployeeCode().equalsIgnoreCase(request.employeeCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Employee code is already registered");
        }
        return repository.save(map(employee, request));
    }

    public void delete(Long id) {
        repository.delete(findById(id));
    }

    private Employee map(Employee employee, EmployeeRequest request) {
        employee.setEmployeeCode(request.employeeCode().trim());
        employee.setFirstName(request.firstName().trim());
        employee.setLastName(request.lastName().trim());
        employee.setEmail(request.email().trim().toLowerCase());
        employee.setDepartment(request.department());
        employee.setDesignation(request.designation());
        employee.setStatus(request.status() == null || request.status().isBlank() ? "ACTIVE" : request.status().toUpperCase());
        employee.setJoiningDate(request.joiningDate());
        return employee;
    }
}
