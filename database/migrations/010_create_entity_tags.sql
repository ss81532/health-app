CREATE TABLE entity_tags (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  tag_id BIGINT NOT NULL,
  entity_type ENUM(
    'medical_record','document','appointment'
  ) NOT NULL,
  entity_id BIGINT NOT NULL,

  CONSTRAINT fk_entity_tags_tag
    FOREIGN KEY (tag_id)
    REFERENCES tags(id)
    ON DELETE CASCADE
);
