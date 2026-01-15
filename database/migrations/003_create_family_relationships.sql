CREATE TABLE family_relationships (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  family_id BIGINT NOT NULL,
  member_id BIGINT NOT NULL,
  related_member_id BIGINT NOT NULL,

  relationship_type ENUM(
    'father','mother','son','daughter',
    'spouse','sibling','grandparent','grandchild'
  ) NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_rel_family
    FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,

  CONSTRAINT fk_rel_member
    FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE,

  CONSTRAINT fk_rel_related
    FOREIGN KEY (related_member_id) REFERENCES family_members(id) ON DELETE CASCADE,

  UNIQUE KEY uq_relationship (
    family_id,
    member_id,
    related_member_id,
    relationship_type
  )
);
