CREATE TABLE medical_documents (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  family_member_id BIGINT NOT NULL,

  document_type ENUM(
    'report','scan','prescription','insurance'
  ),

  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,

  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_docs_member
    FOREIGN KEY (family_member_id)
    REFERENCES family_members(id)
    ON DELETE CASCADE
);
