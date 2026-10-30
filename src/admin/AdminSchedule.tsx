import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Clock, MapPin, X, AlertCircle } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';

export const AdminSchedule: React.FC = () => {
  const { sessions, classes, instructors, refreshData, showToast } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [selectedInstructorId, setSelectedInstructorId] = useState(instructors[0]?.id || '');
  const [startsAt, setStartsAt] = useState('2026-10-30T17:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [room, setRoom] = useState('Studio A (Sun Room)');
  const [capacity, setCapacity] = useState(16);
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId || !selectedInstructorId || !startsAt) {
      showToast('Please fill out all session fields.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const startD = new Date(startsAt);
      const endD = new Date(startD.getTime() + durationMinutes * 60 * 1000);

      await api.createAdminSession({
        classId: selectedClassId,
        instructorId: selectedInstructorId,
        startsAt: startD.toISOString(),
        endsAt: endD.toISOString(),
        capacity: Number(capacity),
        room,
        location: 'ASANA-Yoga Sanctuary',
      });

      showToast('Session successfully scheduled on studio calendar.', 'success');
      setIsModalOpen(false);
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Failed to schedule session', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session? Sessions with active bookings cannot be deleted.')) {
      return;
    }
    try {
      await api.deleteAdminSession(id);
      showToast('Session deleted.', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Cannot delete session with active bookings.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-white">
            Schedule &amp; Sessions Management
          </h1>
          <p className="text-xs text-neutral-400">
            Assign instructors, manage capacity caps, and schedule daily studio time slots.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="space-y-3">
        {sessions.map((s) => {
          const bookedPct = Math.round((s.bookedCount / s.capacity) * 100);

          return (
            <div
              key={s.id}
              className="bg-neutral-800/50 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 sm:w-1/3">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-semibold text-base text-white">
                    {s.classTitle}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Room: {s.room} &bull; Guide: {s.instructorName}
                </p>
              </div>

              <div className="space-y-1 sm:w-1/3">
                <div className="text-neutral-300 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{new Date(s.startsAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>
                    {new Date(s.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &ndash;{' '}
                    {new Date(s.endsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (PST)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3 pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                <div className="text-right">
                  <span className="font-mono text-white text-sm font-semibold block">
                    {s.bookedCount} / {s.capacity} mats
                  </span>
                  <span className={`text-[10px] font-semibold ${
                    bookedPct >= 90 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {bookedPct}% occupancy
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteSession(s.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  title="Delete Session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif font-medium text-lg">Schedule Studio Session</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSession} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Select Class</label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.style})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Assign Instructor</label>
                <select
                  value={selectedInstructorId}
                  onChange={(e) => setSelectedInstructorId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white"
                >
                  {instructors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} &bull; {i.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Start Date &amp; Time</label>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Studio Room</label>
                  <select
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  >
                    <option value="Studio A (Sun Room)">Studio A (Sun Room)</option>
                    <option value="Studio B (Acoustic Chamber)">Studio B (Acoustic Chamber)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Mat Capacity Cap</label>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-white text-neutral-950 font-semibold hover:bg-neutral-200"
                >
                  {isSaving ? 'Scheduling...' : 'Publish Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
