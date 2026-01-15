CREATE TABLE family_members (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  family_id BIGINT NOT NULL,

  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  date_of_birth DATE,
  gender ENUM('male','female','other'),
  blood_group VARCHAR(10),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_members_family
    FOREIGN KEY (family_id)
    REFERENCES families(id)
    ON DELETE CASCADE
);
