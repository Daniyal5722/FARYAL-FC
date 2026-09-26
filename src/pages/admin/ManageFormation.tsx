import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
  Users,
  Grid,
  Info,
  Check,
  Plus,
  Trash2,
  Wand2,
  ArrowRight,
  Eye,
  Activity,
  Sliders
} from 'lucide-react';
import { useThemeSettings } from '../../contexts/ThemeSettingsContext';
import { useToast } from '../../contexts/ToastContext';
import { FormationConfig, FormationType, Player, TacticalPillar } from '../../types';
import { DEFAULT_FORMATION_CONFIG, DEFAULT_TACTICAL_PILLARS } from '../../data/defaultConfig';
import { FORMATIONS, ALL_FORMATION_TYPES, getFormationLineup } from '../../data/formationData';
import { FormationPitch } from '../../components/FormationPitch';
import { api } from '../../lib/api';

export const ManageFormation: React.FC = () => {
  const { formation, updateSettings } = useThemeSettings();
  const { success, error: toastError } = useToast();

  const [formConfig, setFormConfig] = useState<FormationConfig>(
    formation || DEFAULT_FORMATION_CONFIG
  );
  const [activeTab, setActiveTab] = useState<'lineup' | 'tactics' | 'pillars' | 'content'>('lineup');
  const [activePitchFormation, setActivePitchFormation] = useState<FormationType>(
    formation?.defaultFormation || '4-3-3'
  );
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // Sync with context updates
  useEffect(() => {
    if (formation) {
      setFormConfig(formation);
      if (formation.defaultFormation) {
        setActivePitchFormation(formation.defaultFormation);
      }
    }
  }, [formation]);

  // Fetch official squad roster
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const squad = await api.players.getAll();
        setPlayers(squad);
      } catch (err: any) {
        console.error('Failed to fetch players for formation admin:', err);
      } finally {
        setLoadingPlayers(false);
      }
    };
    fetchPlayers();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        formation: formConfig,
      });
      success('Formation and tactical configuration saved successfully!');
    } catch (err: any) {
      toastError(err.message || 'Failed to save formation settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    setResetting(true);
    try {
      setFormConfig(DEFAULT_FORMATION_CONFIG);
      setActivePitchFormation(DEFAULT_FORMATION_CONFIG.defaultFormation);
      setSelectedSlotIndex(null);
      await updateSettings({
        formation: DEFAULT_FORMATION_CONFIG,
      });
      success('Formation settings reverted to factory defaults!');
    } catch (err: any) {
      toastError(err.message || 'Failed to reset formation settings');
    } finally {
      setResetting(false);
    }
  };

  // Toggle enabled formations
  const toggleFormationEnabled = (f: FormationType) => {
    const currentEnabled = formConfig.enabledFormations || ALL_FORMATION_TYPES;
    let updated: FormationType[];
    if (currentEnabled.includes(f)) {
      if (currentEnabled.length <= 1) {
        toastError('At least one formation must remain enabled.');
        return;
      }
      updated = currentEnabled.filter((item) => item !== f);
    } else {
      updated = [...currentEnabled, f];
    }

    // If default formation is disabled, switch default to first enabled
    let newDefault = formConfig.defaultFormation;
    if (!updated.includes(newDefault)) {
      newDefault = updated[0];
    }

    setFormConfig({
      ...formConfig,
      enabledFormations: updated,
      defaultFormation: newDefault,
    });
  };

  // Assign player to a slot in current formation
  const handleAssignPlayer = (positionIndex: number, playerId: string) => {
    const key = `${activePitchFormation}-${positionIndex}`;
    const newLineup = { ...(formConfig.lineup || {}) };
    if (!playerId) {
      delete newLineup[key];
    } else {
      newLineup[key] = playerId;
    }
    setFormConfig({ ...formConfig, lineup: newLineup });
  };

  // Auto-fill lineup by player position
  const handleAutoFillLineup = () => {
    if (players.length === 0) return;

    // Use smart positional assignment to fill all 11 slots with distinct squad players
    const resolved = getFormationLineup(activePitchFormation, players);
    const newLineup = { ...(formConfig.lineup || {}) };

    resolved.forEach((slot) => {
      if (slot.player) {
        newLineup[`${activePitchFormation}-${slot.index}`] = slot.player.id;
      }
    });

    setFormConfig({ ...formConfig, lineup: newLineup });
    success(`Starting XI auto-assigned by positions for ${activePitchFormation}!`);
  };

  // Clear manual lineup for current formation
  const handleClearLineup = () => {
    const newLineup = { ...(formConfig.lineup || {}) };
    const prefix = `${activePitchFormation}-`;
    Object.keys(newLineup).forEach((key) => {
      if (key.startsWith(prefix)) {
        delete newLineup[key];
      }
    });
    setFormConfig({ ...formConfig, lineup: newLineup });
    success(`Cleared manual assignments for ${activePitchFormation}`);
  };

  // Pillar management
  const handleUpdatePillar = (index: number, field: keyof TacticalPillar, value: string) => {
    const pillars = [...(formConfig.tacticalPillars || DEFAULT_TACTICAL_PILLARS)];
    pillars[index] = { ...pillars[index], [field]: value };
    setFormConfig({ ...formConfig, tacticalPillars: pillars });
  };

  const handleAddPillar = () => {
    const pillars = [...(formConfig.tacticalPillars || DEFAULT_TACTICAL_PILLARS)];
    pillars.push({
      title: 'New Tactical Concept',
      desc: 'Describe this tactical principle for the team.',
    });
    setFormConfig({ ...formConfig, tacticalPillars: pillars });
  };

  const handleDeletePillar = (index: number) => {
    const pillars = [...(formConfig.tacticalPillars || DEFAULT_TACTICAL_PILLARS)];
    pillars.splice(index, 1);
    setFormConfig({ ...formConfig, tacticalPillars: pillars });
  };

  const currentPositions = FORMATIONS[activePitchFormation]?.positions || [];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 mb-2 inline-block">
            Tactical Operations
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white italic tracking-tight uppercase">
            Match Formation & <span className="text-blue-500">Tactics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure primary team formations, assign Starting XI player slots, and define club playing philosophy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefaults}
            disabled={resetting || saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
            title="Reset formation settings to factory defaults"
          >
            <RotateCcw size={14} className={resetting ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || resetting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            <span>Save Formation</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'lineup', label: 'Starting XI Lineup', icon: Users },
          { id: 'tactics', label: 'Tactical System & Formations', icon: Sliders },
          { id: 'pillars', label: 'Tactical Philosophy Pillars', icon: Shield },
          { id: 'content', label: 'Header & Directive', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Starting XI Lineup Builder */}
      {activeTab === 'lineup' && (
        <div className="space-y-6">
          {/* Formation Switcher Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                Active Tactical Pitch
              </span>
              <p className="text-sm font-black text-white uppercase italic">
                Editing Lineup For: <span className="text-blue-400">{activePitchFormation}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {ALL_FORMATION_TYPES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setActivePitchFormation(f);
                    setSelectedSlotIndex(null);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase transition-all border ${
                    activePitchFormation === f
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoFillLineup}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-bold text-xs uppercase tracking-wider transition-colors border border-slate-700"
                title="Automatically match available squad players to position labels"
              >
                <Wand2 size={13} />
                <span>Auto-Fill</span>
              </button>
              <button
                type="button"
                onClick={handleClearLineup}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 font-bold text-xs uppercase tracking-wider transition-colors border border-slate-700"
                title="Clear manual assignments for this formation"
              >
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Interactive Pitch + Position Slots Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Interactive Pitch */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Grid size={14} className="text-blue-500" />
                  Tactical Pitch Layout
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">
                  Click any player node to configure slot
                </span>
              </div>

              <div className="w-full">
                <FormationPitch
                  currentFormation={activePitchFormation}
                  customLineup={formConfig.lineup || {}}
                  selectedPosIndex={selectedSlotIndex}
                  showSelector={false}
                  onPositionClick={(idx) => {
                    setSelectedSlotIndex(idx);
                  }}
                />
              </div>

              <p className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                💡 <span className="text-slate-200 font-bold">Pro Tip:</span> Assigned players will appear with their official photo and squad number on the live public website formation pitch.
              </p>
            </div>

            {/* Position Assignment Slot List */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Users size={14} className="text-blue-500" />
                  Starting XI Positions ({currentPositions.length} Slots)
                </h3>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {getFormationLineup(activePitchFormation, players, formConfig.lineup || {}).map((slot) => {
                  const { index: idx, position: pos, player: activePlayer, isExplicit } = slot;
                  const key = `${activePitchFormation}-${idx}`;
                  const assignedPlayerId = isExplicit ? (activePlayer?.id || '') : '';
                  const isSelected = selectedSlotIndex === idx;

                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedSlotIndex(idx)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500/80 ring-2 ring-blue-500/30'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-black text-xs flex items-center justify-center">
                            {pos.label}
                          </span>
                          <span className="text-xs font-black text-white uppercase tracking-wider">
                            Slot {idx + 1}
                          </span>
                        </div>

                        {isExplicit && activePlayer ? (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                            #{activePlayer.number ?? '-'} Manual
                          </span>
                        ) : activePlayer ? (
                          <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                            Auto: #{activePlayer.number ?? '-'} {activePlayer.name.split(' ')[0]}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={assignedPlayerId || ''}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleAssignPlayer(idx, e.target.value);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-blue-500"
                        >
                          <option value="">
                            {activePlayer && !isExplicit 
                              ? `Auto-Matched (#${activePlayer.number ?? '-'} ${activePlayer.name})` 
                              : `Auto-Match (${pos.label} Default)`}
                          </option>
                          {players.map((p) => (
                            <option key={p.id} value={p.id}>
                              #{p.number ?? '-'} {p.name} ({p.position})
                            </option>
                          ))}
                        </select>

                        {assignedPlayerId && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignPlayer(idx, '');
                            }}
                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Reset to smart auto-match"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Tactical System & Formations */}
      {activeTab === 'tactics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Sliders className="text-blue-500" size={18} />
              Primary & Available Formations
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Set which tactical system Faryal FC displays by default and allow visitors to toggle alternative formations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Default Formation Selector */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                Default Match Formation
              </label>
              <p className="text-[11px] text-slate-400">
                This formation loads automatically when fans visit the public Match Formation page.
              </p>

              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {ALL_FORMATION_TYPES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormConfig({ ...formConfig, defaultFormation: f })}
                    className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
                      formConfig.defaultFormation === f
                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Enabled Formations Multi-Select */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider">
                Available Formations for Public Fans
              </label>
              <p className="text-[11px] text-slate-400">
                Select which formations can be selected using the toggle pill buttons on the public page.
              </p>

              <div className="space-y-2 pt-2">
                {ALL_FORMATION_TYPES.map((f) => {
                  const isEnabled = (formConfig.enabledFormations || ALL_FORMATION_TYPES).includes(f);
                  return (
                    <label
                      key={f}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isEnabled
                          ? 'bg-slate-900 border-slate-700'
                          : 'bg-slate-900/40 border-slate-800/40 opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => toggleFormationEnabled(f)}
                          className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-800"
                        />
                        <span className="text-xs font-black text-white uppercase tracking-wider">
                          {f} Formation
                        </span>
                      </div>

                      {formConfig.defaultFormation === f && (
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          Default
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Philosophy Pillars */}
      {activeTab === 'pillars' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Shield className="text-blue-500" size={18} />
                Club Tactical Philosophy Pillars
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize the 3 strategic tenets (Attacking, Defensive, Midfield) displayed below the pitch.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFormConfig({ ...formConfig, tacticalPillars: DEFAULT_TACTICAL_PILLARS })}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Reset Pillars
              </button>
              <button
                type="button"
                onClick={handleAddPillar}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                <Plus size={14} />
                <span>Add Pillar</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {(formConfig.tacticalPillars || DEFAULT_TACTICAL_PILLARS).map((pillar, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                    Pillar 0{idx + 1}
                  </span>
                  {(formConfig.tacticalPillars || DEFAULT_TACTICAL_PILLARS).length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeletePillar(idx)}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                      title="Delete Pillar"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Pillar Title
                    </label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => handleUpdatePillar(idx, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-blue-500"
                      placeholder="e.g. Attacking Philosophy"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                      Description & Principles
                    </label>
                    <textarea
                      rows={2}
                      value={pillar.desc}
                      onChange={(e) => handleUpdatePillar(idx, 'desc', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 font-medium outline-none focus:border-blue-500"
                      placeholder="Describe the tactical implementation..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Content & Directives */}
      {activeTab === 'content' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="text-blue-500" size={18} />
              Page Content & Coach Directives
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure public copy and matchday tactical directives shown on the formation page.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Page Headline Title
              </label>
              <input
                type="text"
                value={formConfig.title ?? 'MATCH FORMATION'}
                onChange={(e) => setFormConfig({ ...formConfig, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="MATCH FORMATION"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Category Kicker / Subtitle
              </label>
              <input
                type="text"
                value={formConfig.subtitle ?? 'Tactical Center'}
                onChange={(e) => setFormConfig({ ...formConfig, subtitle: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-bold outline-none focus:border-blue-500"
                placeholder="Tactical Center"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Page Introduction Description
              </label>
              <textarea
                rows={3}
                value={formConfig.description ?? 'Explore the tactical setups used by Faryal FC. Switch between different formations to see our strategic lineup.'}
                onChange={(e) => setFormConfig({ ...formConfig, description: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="Briefly introduce the club tactical structure..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                Head Coach Matchday Directive / Tactical Notes
              </label>
              <textarea
                rows={3}
                value={formConfig.tacticalNotes ?? ''}
                onChange={(e) => setFormConfig({ ...formConfig, tacticalNotes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-medium outline-none focus:border-blue-500"
                placeholder="e.g. High-pressing 4-3-3 with quick diagonal switches to our wingers. Compact defensive structure when out of possession."
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                When provided, this is highlighted as an official quote from the coaching staff above the tactical pitch.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
