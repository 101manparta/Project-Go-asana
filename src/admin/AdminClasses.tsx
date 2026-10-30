import React, { useState } from 'react';
import { Plus, Edit, Trash2, Clock, Check, X, BookOpen, AlertCircle } from 'lucide-react';
import { useStudio } from '../context/StudioContext';
import { api } from '../services/api';
import { YogaClass } from '../types';

export const AdminClasses: React.FC = () => {
  const { classes, refreshData, showToast } = useStudio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<YogaClass | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState('Vinyasa Flow');
  const [level, setLevel] = useState('All Levels');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [priceDollars, setPriceDollars] = useState(28);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80');
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenCreate = () => {
    setEditingClass(null);
    setTitle('');
    setStyle('Vinyasa Flow');
    setLevel('All Levels');
    setDurationMinutes(60);
    setPriceDollars(28);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: YogaClass) => {
    setEditingClass(c);
    setTitle(c.title);
    setStyle(c.style);
    setLevel(c.level);
    setDurationMinutes(c.durationMinutes);
    setPriceDollars(c.price / 100);
    setDescription(c.description);
    setImageUrl(c.imageUrl);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !style) {
      showToast('Please fill out required title and style.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      if (editingClass) {
        await api.updateAdminClass(editingClass.id, {
          title,
          style: style as any,
          level: level as any,
          durationMinutes: Number(durationMinutes),
          price: Number(priceDollars) * 100,
          description,
          imageUrl,
        });
        showToast('Class updated successfully.', 'success');
      } else {
        await api.createAdminClass({
          title,
          style: style as any,
          level: level as any,
          durationMinutes: Number(durationMinutes),
          price: Number(priceDollars),
          description,
          imageUrl,
        });
        showToast('New class created successfully.', 'success');
      }
      setIsModalOpen(false);
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? Classes with active bookings will be protected.')) {
      return;
    }
    try {
      await api.deleteAdminClass(classId);
      showToast('Class deleted.', 'success');
      await refreshData();
    } catch (err: any) {
      showToast(err.message || 'Cannot delete class with active reservations.', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-white">
            Class Modalities Catalog
          </h1>
          <p className="text-xs text-neutral-400">
            Create, refine, and manage published yoga practices and sound sanctuaries.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-semibold hover:bg-neutral-200 transition-colors flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Class</span>
        </button>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c) => (
          <div
            key={c.id}
            className="bg-neutral-800/50 border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-neutral-900">
                <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {c.style}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-neutral-950">
                    {c.level}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-xs font-mono font-semibold text-white">
                  ${(c.price / 100).toFixed(2)}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                  <Clock className="w-3 h-3" />
                  <span>{c.durationMinutes} min</span>
                  <span>&bull;</span>
                  <span>4h cancellation window</span>
                </div>

                <h3 className="font-serif font-semibold text-base text-white">
                  {c.title}
                </h3>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-neutral-900/50 flex items-center justify-between text-xs">
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Published
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 transition-colors cursor-pointer"
                  title="Edit Class"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  title="Delete Class"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-serif font-medium text-lg">
                {editingClass ? 'Edit Yoga Class' : 'Create New Yoga Class'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Class Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Candlelight Sound Sanctuary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Practice Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  >
                    <option value="Vinyasa Flow">Vinyasa Flow</option>
                    <option value="Yin & Sound">Yin &amp; Sound</option>
                    <option value="Ashtanga Primary">Ashtanga Primary</option>
                    <option value="Restorative & Nidra">Restorative &amp; Nidra</option>
                    <option value="Hatha Foundation">Hatha Foundation</option>
                    <option value="Kundalini & Breathwork">Kundalini &amp; Breath</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Duration (minutes)</label>
                  <input
                    type="number"
                    min="30"
                    max="120"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-300 font-medium">Drop-In Price ($ USD)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={priceDollars}
                    onChange={(e) => setPriceDollars(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe somatic pacing, breathwork, and posture focus..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-800 border border-white/10 text-white resize-none"
                />
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
                  {isSaving ? 'Saving...' : editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
