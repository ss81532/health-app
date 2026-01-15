CREATE TABLE member_genetic_conditions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  family_member_id BIGINT NOT NULL,
  genetic_condition_id BIGINT NOT NULL,

  inherited_from ENUM('father','mother','both','unknown'),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_mgc_member
    FOREIGN KEY (family_member_id)
    REFERENCES family_members(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_mgc_condition
    FOREIGN KEY (genetic_condition_id)
    REFERENCES genetic_conditions(id)
    ON DELETE CASCADE,

  UNIQUE KEY uq_member_condition (
    family_member_id,
    genetic_condition_id
  )
);
