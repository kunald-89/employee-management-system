package com.kunaldange.ems.employee;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record EmployeeRequest(
        @NotBlank @Size(max = 30) String employeeCode,
        @NotBlank @Size(max = 80) String firstName,
        @NotBlank @Size(max = 80) String lastName,
        @NotBlank @Email @Size(max = 180) String email,
        @Size(max = 100) String department,
        @Size(max = 100) String designation,
        @Size(max = 20) String status,
        LocalDate joiningDate
) {}
