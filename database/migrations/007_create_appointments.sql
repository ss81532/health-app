CREATE TABLE appointments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  family_member_id BIGINT NOT NULL,

  doctor_name VARCHAR(255),
  hospital_name VARCHAR(255),

  appointment_date DATETIME NOT NULL,
  purpose TEXT,

  status ENUM('scheduled','completed','cancelled')
    DEFAULT 'scheduled',

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_appointments_member
    FOREIGN KEY (family_member_id)
    REFERENCES family_members(id)
    ON DELETE CASCADE
);
