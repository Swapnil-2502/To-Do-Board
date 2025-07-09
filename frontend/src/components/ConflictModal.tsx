import React from "react";
import "./ConflictModal.css"; // styling separately
import type { Task, TaskPayload } from "../types";

type ConflictModalProps = {
  serverVersion: Task;
  localVersion: TaskPayload;
  onCancel: () => void;
  onOverwrite: () => void;
  onMerge: () => void;
};

const ConflictModal: React.FC<ConflictModalProps> = ({
  serverVersion,
  localVersion,
  onCancel,
  onOverwrite,
  onMerge,
}) => {
  return (
    <div className="conflict-modal-backdrop">
      <div className="conflict-modal">
        <h2>⚠️ Edit Conflict Detected</h2>
        <p>
          This task was updated by someone else while you were editing. Please
          review both versions before proceeding.
        </p>

        <div className="conflict-columns">
          <div className="conflict-column">
            <h4>📦 Latest (Saved)</h4>
            <p><strong>Title:</strong> {serverVersion.title}</p>
            <p><strong>Description:</strong> {serverVersion.description}</p>
            <p><strong>Status:</strong> {serverVersion.status}</p>
            <p><strong>Priority:</strong> {serverVersion.priority}</p>
          </div>

          <div className="conflict-column">
            <h4>📝 Your Edits</h4>
            <p><strong>Title:</strong> {localVersion.title}</p>
            <p><strong>Description:</strong> {localVersion.description}</p>
            <p><strong>Status:</strong> {localVersion.status}</p>
            <p><strong>Priority:</strong> {localVersion.priority}</p>
          </div>
        </div>

        <div className="conflict-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onOverwrite} className="btn-danger">Overwrite</button>
          <button onClick={onMerge} className="btn-primary">Merge Manually</button>
        </div>
      </div>
    </div>
  );
};

export default ConflictModal;
