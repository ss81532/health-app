CREATE TABLE genetic_conditions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    family_member_id BIGINT NOT NULL,
    condition_name VARCHAR(255) NOT NULL,
    description TEXT,
    severity ENUM('mild','moderate','severe'),
    diagnosed_at DATE,
    is_inherited BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_genetic_conditions_member
        FOREIGN KEY (family_member_id)
        REFERENCES family_members(id)
        ON DELETE CASCADE
);
