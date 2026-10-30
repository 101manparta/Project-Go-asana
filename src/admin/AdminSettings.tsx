import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, MessageSquare, Bell } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';
import { StudioSettings } from '../types';

export const AdminSettings: React.FC = () => {
  const { settings, showToast, refreshData } = useStudio();

  const [form, setForm] = useState<StudioSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({ ...settings });
    }
  }, [settings]);

  if (!form) return <div className="text-white text-xs">Loading studio settings...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateAdminSettings(form);
      await refreshData();
      showToast('Studio settings saved successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-medium text-white">
          Studio Configuration &amp; Governance
        </h1>
        <p className="text-xs text-neutral-400">
          Manage business parameters, cancellation rules, AI model configuration, and announcement banners.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs text-neutral-300">
        
        {/* Studio Identity */}
        <div className="bg-neutral-800/50 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif font-medium text-sm text-white">
            Studio Identity &amp; Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Studio Public Name</label>
              <input
                type="text"
                value={form.studioName}
                onChange={(e) => setForm({ ...form, studioName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-neutral-400 font-medium">Sanctuary Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Telephone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">WhatsApp</label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Policies & Operations */}
        <div className="bg-neutral-800/50 border border-white/10 rounded-2xl p-6 space-y-4">
          <h3 className="font-serif font-medium text-sm text-white">
            Operational Policies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Cancellation Deadline Window (Hours)</label>
              <input
                type="number"
                min="1"
                max="48"
                value={form.cancellationWindowHours}
                onChange={(e) => setForm({ ...form, cancellationWindowHours: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 block">
                Customers must cancel at least this many hours prior to session start.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Studio Time Zone</label>
              <select
                value={form.defaultTimeZone}
                onChange={(e) => setForm({ ...form, defaultTimeZone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white"
              >
                <option value="America/Los_Angeles">America/Los_Angeles (Pacific Time)</option>
                <option value="America/New_York">America/New_York (Eastern Time)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Model Controls */}
        <div className="bg-neutral-800/50 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-neutral-300" />
              <h3 className="font-serif font-medium text-sm text-white">
                ASANA Wellness Guide Controls
              </h3>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.aiAssistantEnabled}
                onChange={(e) => setForm({ ...form, aiAssistantEnabled: e.target.checked })}
                className="rounded accent-white"
              />
              <span className="text-xs text-neutral-300">Feature Active</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-neutral-400 font-medium">Model Alias</label>
            <input
              type="text"
              value={form.aiModelName}
              onChange={(e) => setForm({ ...form, aiModelName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-neutral-400 font-medium">Approved System Instructions</label>
            <textarea
              rows={4}
              value={form.aiSystemInstruction}
              onChange={(e) => setForm({ ...form, aiSystemInstruction: e.target.value })}
              className="w-full p-3 rounded-xl bg-neutral-900 border border-white/10 text-white resize-none font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-white text-neutral-950 font-semibold text-xs hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
