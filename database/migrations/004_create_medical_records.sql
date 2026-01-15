CREATE TABLE medical_records (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  family_member_id BIGINT NOT NULL,

  record_type ENUM(
    'consultation','diagnosis',
    'prescription','test_result'
  ) NOT NULL,

  description TEXT NOT NULL,
  record_date DATE NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_records_member
    FOREIGN KEY (family_member_id)
    REFERENCES family_members(id)
    ON DELETE CASCADE
);
