import { FormationType, Player } from '../types';

export interface FormationPosition {
  x: number;
  y: number;
  label: string;
}

export interface FormationDefinition {
  name: string;
  positions: FormationPosition[];
}

// Coordinates calibrated for a realistic vertical football pitch (GK at bottom ~91%, ST at top ~18-22%)
export const FORMATIONS: Record<FormationType, FormationDefinition> = {
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { x: 50, y: 91, label: 'GK' },
      { x: 18, y: 76, label: 'LB' }, { x: 38, y: 78, label: 'CB' }, { x: 62, y: 78, label: 'CB' }, { x: 82, y: 76, label: 'RB' },
      { x: 18, y: 52, label: 'LM' }, { x: 38, y: 54, label: 'CM' }, { x: 62, y: 54, label: 'CM' }, { x: 82, y: 52, label: 'RM' },
      { x: 38, y: 22, label: 'ST' }, { x: 62, y: 22, label: 'ST' },
    ],
  },
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { x: 50, y: 91, label: 'GK' },
      { x: 18, y: 76, label: 'LB' }, { x: 38, y: 78, label: 'CB' }, { x: 62, y: 78, label: 'CB' }, { x: 82, y: 76, label: 'RB' },
      { x: 32, y: 56, label: 'CM' }, { x: 50, y: 64, label: 'CDM' }, { x: 68, y: 56, label: 'CM' },
      { x: 20, y: 24, label: 'LW' }, { x: 50, y: 18, label: 'ST' }, { x: 80, y: 24, label: 'RW' },
    ],
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { x: 50, y: 91, label: 'GK' },
      { x: 18, y: 76, label: 'LB' }, { x: 38, y: 78, label: 'CB' }, { x: 62, y: 78, label: 'CB' }, { x: 82, y: 76, label: 'RB' },
      { x: 36, y: 64, label: 'CDM' }, { x: 64, y: 64, label: 'CDM' },
      { x: 18, y: 44, label: 'LM' }, { x: 50, y: 42, label: 'CAM' }, { x: 82, y: 44, label: 'RM' },
      { x: 50, y: 18, label: 'ST' },
    ],
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { x: 50, y: 91, label: 'GK' },
      { x: 28, y: 77, label: 'CB' }, { x: 50, y: 79, label: 'CB' }, { x: 72, y: 77, label: 'CB' },
      { x: 14, y: 52, label: 'LWB' }, { x: 36, y: 58, label: 'CM' }, { x: 50, y: 65, label: 'CDM' }, { x: 64, y: 58, label: 'CM' }, { x: 86, y: 52, label: 'RWB' },
      { x: 38, y: 22, label: 'ST' }, { x: 62, y: 22, label: 'ST' },
    ],
  },
  '3-4-3': {
    name: '3-4-3',
    positions: [
      { x: 50, y: 91, label: 'GK' },
      { x: 28, y: 77, label: 'CB' }, { x: 50, y: 79, label: 'CB' }, { x: 72, y: 77, label: 'CB' },
      { x: 18, y: 54, label: 'LM' }, { x: 38, y: 58, label: 'CM' }, { x: 62, y: 58, label: 'CM' }, { x: 82, y: 54, label: 'RM' },
      { x: 22, y: 24, label: 'LW' }, { x: 50, y: 18, label: 'ST' }, { x: 78, y: 24, label: 'RW' },
    ],
  },
  '5-3-2': {
    name: '5-3-2',
    positions: [
      { x: 50, y: 91, label: 'GK' },
      { x: 14, y: 74, label: 'LWB' }, { x: 32, y: 78, label: 'CB' }, { x: 50, y: 79, label: 'CB' }, { x: 68, y: 78, label: 'CB' }, { x: 86, y: 74, label: 'RWB' },
      { x: 32, y: 56, label: 'CM' }, { x: 50, y: 64, label: 'CDM' }, { x: 68, y: 56, label: 'CM' },
      { x: 38, y: 22, label: 'ST' }, { x: 62, y: 22, label: 'ST' },
    ],
  },
};

export const ALL_FORMATION_TYPES: FormationType[] = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '3-4-3', '5-3-2'];

/**
 * Checks if a player's position (e.g. "Goalkeeper", "Defender", "Midfielder", "Forward", "CB", "ST")
 * matches a tactical pitch slot position label (e.g. "GK", "LB", "CB", "RB", "CM", "CDM", "LW", "RW", "ST").
 */
export function isPositionRoleMatch(playerPosition?: string, positionLabel?: string): boolean {
  if (!playerPosition || !positionLabel) return false;
  const p = playerPosition.trim().toLowerCase();
  const l = positionLabel.trim().toUpperCase();

  // Direct match
  if (p === l.toLowerCase()) return true;

  // Goalkeeper
  if (l === 'GK') {
    return p.includes('goal') || p === 'gk' || p.includes('keeper');
  }

  // Defenders
  if (['CB', 'LB', 'RB', 'LWB', 'RWB', 'DEF'].includes(l)) {
    if (p.includes('def') || p.includes('back')) return true;
    return false;
  }

  // Midfielders
  if (['CM', 'CDM', 'CAM', 'LM', 'RM', 'MID'].includes(l)) {
    if (p.includes('mid')) return true;
    return false;
  }

  // Forwards / Attackers
  if (['ST', 'CF', 'LW', 'RW', 'FWD'].includes(l)) {
    if (p.includes('forw') || p.includes('strik') || p.includes('wing') || p.includes('att')) return true;
    return false;
  }

  return false;
}

export interface ResolvedPitchSlot {
  index: number;
  position: FormationPosition;
  player?: Player;
  isExplicit: boolean;
}

/**
 * Resolves the 11 Starting XI positions on the tactical pitch, ensuring:
 * 1. Explicit admin assignments are respected.
 * 2. Unassigned positions are filled by unique squad players matched by their real position roles.
 * 3. No player is duplicated on the pitch when squad depth allows.
 */
export function getFormationLineup(
  formation: FormationType,
  players: Player[],
  customLineup?: Record<string, string>
): ResolvedPitchSlot[] {
  const formationDef = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const positions = formationDef.positions;

  if (!players || players.length === 0) {
    return positions.map((pos, idx) => ({
      index: idx,
      position: pos,
      player: undefined,
      isExplicit: false,
    }));
  }

  const result: (Player | undefined)[] = new Array(positions.length).fill(undefined);
  const isExplicitSlot: boolean[] = new Array(positions.length).fill(false);
  const usedPlayerIds = new Set<string>();

  // 1. Explicit manual assignments from customLineup
  positions.forEach((_, idx) => {
    const key = `${formation}-${idx}`;
    const explicitId = customLineup?.[key];
    if (explicitId) {
      const found = players.find((p) => p.id === explicitId);
      if (found) {
        result[idx] = found;
        isExplicitSlot[idx] = true;
        usedPlayerIds.add(found.id);
      }
    }
  });

  // 2. Exact match on pos.label
  positions.forEach((pos, idx) => {
    if (result[idx]) return;
    const match = players.find(
      (p) => !usedPlayerIds.has(p.id) && p.position?.toLowerCase() === pos.label.toLowerCase()
    );
    if (match) {
      result[idx] = match;
      usedPlayerIds.add(match.id);
    }
  });

  // 3. Positional role category match (Goalkeeper -> GK, Defender -> CB/LB/RB, Midfielder -> CM/CDM/CAM, Forward -> ST/LW/RW)
  positions.forEach((pos, idx) => {
    if (result[idx]) return;
    const match = players.find(
      (p) => !usedPlayerIds.has(p.id) && isPositionRoleMatch(p.position, pos.label)
    );
    if (match) {
      result[idx] = match;
      usedPlayerIds.add(match.id);
    }
  });

  // 4. Any remaining unused squad player
  positions.forEach((_, idx) => {
    if (result[idx]) return;
    const match = players.find((p) => !usedPlayerIds.has(p.id));
    if (match) {
      result[idx] = match;
      usedPlayerIds.add(match.id);
    }
  });

  // 5. Fallback if squad has fewer than 11 players
  positions.forEach((_, idx) => {
    if (!result[idx]) {
      result[idx] = players[idx % players.length];
    }
  });

  return positions.map((pos, idx) => ({
    index: idx,
    position: pos,
    player: result[idx],
    isExplicit: isExplicitSlot[idx],
  }));
}
