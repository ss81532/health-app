import { useState } from "react";
import "./CreateFamilyModal.css";

interface Props {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateFamilyModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");

  function handleSubmit() {
    if (!name.trim()) {
      alert("Family name is required");
      return;
    }
    onCreate(name.trim());
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Family</h2>

        <input
          type="text"
          placeholder="Family name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-btn" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
