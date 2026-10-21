import type { Role } from './owco';

/** 7 stages chosen from a dropdown (the "stage list"). */
export const STAGE_LIST_STAGES = [
  'Shipment created',
  'Passing copy received',
  'Copy documents received',
  'Clearance assigned to CHA',
  'Filed',
  'Ready for delivery',
  'Delivered',
] as const;

/** 4 stages recorded as checkboxes on the shipment. */
export const CHECKBOX_STAGES = [
  'Awaiting physical documents',
  'Received physical documents',
  'Physical documents sent to CHA',
  'Awaiting telex',
] as const;

/** Full 11-stage workflow definition (order = flow order). */
export const ALL_STAGES = [
  { id: 1, label: 'Shipment created', type: 'stage' as const },
  { id: 2, label: 'Passing copy received', type: 'stage' as const },
  { id: 3, label: 'Copy documents received', type: 'stage' as const },
  { id: 4, label: 'Awaiting physical documents', type: 'checkbox' as const },
  { id: 5, label: 'Received physical documents', type: 'checkbox' as const },
  { id: 6, label: 'Clearance assigned to CHA', type: 'stage' as const },
  { id: 7, label: 'Physical documents sent to CHA', type: 'checkbox' as const },
  { id: 8, label: 'Filed', type: 'stage' as const },
  { id: 9, label: 'Awaiting telex', type: 'checkbox' as const },
  { id: 10, label: 'Ready for delivery', type: 'stage' as const },
  { id: 11, label: 'Delivered', type: 'stage' as const },
];

export type StageType = 'stage' | 'checkbox';

/** Which role is allowed to update each stage (by stage id). */
export const STAGE_UPDATERS: Record<number, Role[]> = {
  1: ['admin', 'shipper'],
  2: ['admin'],
  3: ['admin'],
  4: ['admin'],
  5: ['admin'],
  6: ['admin'],
  7: ['admin'],
  8: ['cha'],
  9: ['cha'],
  10: ['cha'],
  11: ['cha'],
};

export const canUpdateStage = (role: Role, stageId: number) =>
  (STAGE_UPDATERS[stageId] ?? []).includes(role);

/** Which stage-list stages a role can select in the dropdown. */
export const stagesForRole = (role: Role): readonly string[] => {
  if (role === 'admin') return STAGE_LIST_STAGES;
  if (role === 'cha') return ['Filed', 'Ready for delivery', 'Delivered'];
  return []; // shipper and receiver are read-only for stage changes
};

/** CHA options scoped to the port of discharge. */
export const CHAS_BY_POD: Record<string, string[]> = {
  BOM: ['InterlinkShipping', 'MPT'],
  CHE: ['acnt'],
  KOL: ['InterlinkShipping'],
  DEL: ['acnt'],
};

export const chasForPod = (pod: string): string[] => CHAS_BY_POD[pod] ?? ['InterlinkShipping'];

// ── Migration from the old 9-status model to the new 11-stage model ──
const MIGRATION: Record<string, { stage: string; checkboxes: string[] }> = {
  'Shipment Created': { stage: 'Shipment created', checkboxes: [] },
  'Awaiting Review': { stage: 'Passing copy received', checkboxes: [] },
  'Awaiting Documents': { stage: 'Copy documents received', checkboxes: ['Awaiting physical documents'] },
  'Received Documents': { stage: 'Copy documents received', checkboxes: ['Awaiting physical documents', 'Received physical documents'] },
  'Clearance Assigned': { stage: 'Clearance assigned to CHA', checkboxes: ['Awaiting physical documents', 'Received physical documents'] },
  'Filed': { stage: 'Filed', checkboxes: ['Awaiting physical documents', 'Received physical documents', 'Physical documents sent to CHA'] },
  'Awaiting Telex': { stage: 'Filed', checkboxes: ['Awaiting physical documents', 'Received physical documents', 'Physical documents sent to CHA', 'Awaiting telex'] },
  'Ready for Delivery': { stage: 'Ready for delivery', checkboxes: ['Awaiting physical documents', 'Received physical documents', 'Physical documents sent to CHA', 'Awaiting telex'] },
  'Delivered': { stage: 'Delivered', checkboxes: ['Awaiting physical documents', 'Received physical documents', 'Physical documents sent to CHA', 'Awaiting telex'] },
};

export function migrateStatus(oldStatus: string, today: string, user: string) {
  const m = MIGRATION[oldStatus] ?? { stage: 'Shipment created', checkboxes: [] };
  const checkboxes: Record<string, { checked: boolean; date: string; user: string }> = {};
  for (const cb of CHECKBOX_STAGES) {
    if (m.checkboxes.includes(cb)) {
      checkboxes[cb] = { checked: true, date: today, user };
    }
  }
  return { status: m.stage, checkboxes };
}

/** Is a given stage (by id) completed, given current status + checkbox states? */
export function isStageDone(
  stageId: number,
  status: string,
  checkboxes: Record<string, { checked: boolean; date: string; user: string }> | undefined,
): boolean {
  const stage = ALL_STAGES.find((s) => s.id === stageId)!;
  if (stage.type === 'stage') {
    const idx = STAGE_LIST_STAGES.indexOf(stage.label as (typeof STAGE_LIST_STAGES)[number]);
    const cur = STAGE_LIST_STAGES.indexOf(status as (typeof STAGE_LIST_STAGES)[number]);
    return idx >= 0 && cur >= 0 && idx <= cur;
  }
  return checkboxes?.[stage.label]?.checked ?? false;
}

/** Late shipment: ETA has passed and status is not Delivered / Ready for delivery. */
export function isShipmentLate(status: string, eta: string, today: string): boolean {
  if (status === 'Delivered' || status === 'Ready for delivery') return false;
  if (!eta) return false;
  return eta < today;
}

/** Payment coming due: date is within N days from today. */
export function isPaymentDue(dueDate: string, today: string, daysAhead = 7): boolean {
  if (!dueDate) return false;
  const diff = (new Date(dueDate).getTime() - new Date(today).getTime()) / 86_400_000;
  return diff >= 0 && diff <= daysAhead;
}
