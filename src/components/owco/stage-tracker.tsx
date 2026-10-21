import { ArrowRight, ArrowDown, Check } from 'lucide-react';
import {
  ALL_STAGES,
  CHECKBOX_STAGES,
  canUpdateStage,
  isStageDone,
  type CheckboxStageState,
} from '@/lib/owco-stages';
import type { Role } from '@/lib/owco';
import './stage-tracker.css';

type CheckboxMap = Record<string, CheckboxStageState>;

/** Visual 11-step workflow tracker matching the spec diagram. */
export function StageTracker({
  status,
  checkboxes,
  role,
}: {
  status: string;
  checkboxes: CheckboxMap | undefined;
  role: Role;
}) {
  const row1 = ALL_STAGES.filter((s) => s.id <= 6);
  const row2 = ALL_STAGES.filter((s) => s.id >= 7);

  const currentStage = ALL_STAGES.find((s) => s.label === status);
  const currentId = currentStage?.id ?? 1;

  const renderNode = (stage: (typeof ALL_STAGES)[number]) => {
    const done = isStageDone(stage.id, status, checkboxes);
    const isCurrent = stage.id === currentId;
    const isCheckbox = stage.type === 'checkbox';
    const isShaded = stage.id === 1 || stage.id === 11;

    return (
      <div className="stage-node" key={stage.id}>
        <div
          className={[
            'stage-box',
            isCheckbox ? 'checkbox-type' : '',
            isShaded ? 'shaded' : '',
            done ? 'done' : '',
            isCurrent ? 'current' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="stage-num">{stage.id}</span>
          <span className="stage-label">{stage.label}</span>
          {done && !isCurrent && <Check size={12} className="stage-check-icon" />}
        </div>
      </div>
    );
  };

  return (
    <div className="stage-tracker">
      <div className="stage-tracker-rows">
        <div className="stage-tracker-row">
          {row1.map((stage, i) => (
            <div className="stage-node" key={stage.id} style={{ display: 'contents' }}>
              {renderNode(stage)}
              {i < row1.length - 1 && (
                <div className="stage-arrow">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="stage-row-break">
          <ArrowDown size={14} />
        </div>
        <div className="stage-tracker-row">
          {row2.map((stage, i) => (
            <div className="stage-node" key={stage.id} style={{ display: 'contents' }}>
              {renderNode(stage)}
              {i < row2.length - 1 && (
                <div className="stage-arrow">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="stage-legend">
        <div className="stage-legend-item">
          <span className="stage-legend-box" />
          Chosen from the stage list
        </div>
        <div className="stage-legend-item">
          <span className="stage-legend-box dashed" />
          A check box on the shipment
        </div>
      </div>
    </div>
  );
}

/** Separate checkbox section for the 4 checkbox stages, with date + user audit. */
export function StageCheckboxes({
  checkboxes,
  role,
  onToggle,
}: {
  checkboxes: CheckboxMap | undefined;
  role: Role;
  onToggle: (stage: string, checked: boolean) => void;
}) {
  return (
    <div className="stage-checkboxes">
      <div className="stage-checkboxes-title">Checkbox stages</div>
      <div className="stage-checkbox-list">
        {CHECKBOX_STAGES.map((label) => {
          const stageDef = ALL_STAGES.find((s) => s.label === label)!;
          const state = checkboxes?.[label];
          const isChecked = state?.checked ?? false;
          const canToggle = canUpdateStage(role, stageDef.id);

          return (
            <div
              className={`stage-checkbox-item ${isChecked ? 'checked' : ''}`}
              key={label}
            >
              <div className="stage-checkbox-top">
                <input
                  type="checkbox"
                  id={`cb-${label}`}
                  checked={isChecked}
                  disabled={!canToggle}
                  onChange={(e) => onToggle(label, e.target.checked)}
                />
                <label htmlFor={`cb-${label}`}>{label}</label>
              </div>
              {isChecked && state && (
                <div className="stage-checkbox-meta">
                  <span>{state.date || '—'}</span>
                  <span>by {state.user || '—'}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Stage history audit trail — shows each stage change with date and user. */
export function StageHistory({
  history,
}: {
  history: { stage: string; date: string; user: string }[] | undefined;
}) {
  if (!history?.length) return null;
  return (
    <div className="stage-history">
      <div className="stage-history-title">Stage history</div>
      <div className="stage-history-list">
        {[...history].reverse().map((h, i) => (
          <div className="stage-history-row" key={i}>
            <strong>{h.stage}</strong>
            <span>{h.date}</span>
            <span>by {h.user}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
