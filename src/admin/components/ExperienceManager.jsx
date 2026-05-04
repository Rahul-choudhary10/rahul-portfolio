import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCollection, firestoreAdd, firestoreUpdate, firestoreDelete } from '../../hooks/useFirestore';
import { SectionHeader, Loader } from './PersonalInfoManager';

const EMPTY_FORM = {
  company: '', role: '', duration: '', location: '',
  description: '', technologies: '', order: 0,
};

export default function ExperienceManager() {
  const { data: experience, loading } = useCollection('experience', 'order');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm({ ...EMPTY_FORM, order: experience.length }); setEditingId(null); setShowForm(true); };
  const openEdit = (exp) => {
    setForm({
      company: exp.company || '', role: exp.role || '', duration: exp.duration || '',
      location: exp.location || '', description: exp.description || '',
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies || '',
      order: exp.order || 0,
    });
    setEditingId(exp.id); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) { toast.error('Company and role are required.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies ? form.technologies.split(',').map((t) => t.trim()).filter(Boolean) : [],
        order: Number(form.order),
      };
      if (editingId) {
        await firestoreUpdate('experience', editingId, payload);
        toast.success('Experience updated!');
      } else {
        await firestoreAdd('experience', payload);
        toast.success('Experience added!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience entry?')) return;
    try { await firestoreDelete('experience', id); toast.success('Deleted.'); } catch (err) { toast.error(err.message); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Experience" subtitle={`${experience.length} entr${experience.length !== 1 ? 'ies' : 'y'}`} />
        <motion.button onClick={openAdd} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiPlus size={16} /> Add Entry
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div className="glass rounded-2xl p-6 border border-purple-500/20" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{editingId ? 'Edit Experience' : 'Add Experience'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Company *</label>
                <input className="admin-input" placeholder="Wipro" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Role / Title *</label>
                <input className="admin-input" placeholder="Software Developer" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Duration</label>
                <input className="admin-input" placeholder="Jan 2022 – Present" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Location</label>
                <input className="admin-input" placeholder="Bengaluru, India" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Description</label>
                <textarea className="admin-input resize-none" rows={3} placeholder="Describe your responsibilities..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Technologies (comma-separated)</label>
                <input className="admin-input" placeholder="Java, Spring Boot, React, MySQL" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Display Order</label>
                <input type="number" className="admin-input" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg text-sm text-gray-400 border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <motion.button type="submit" disabled={saving} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4 disabled:opacity-60" whileHover={{ scale: 1.03 }}>
                  {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={15} />}
                  {editingId ? 'Update' : 'Add'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {experience.map((exp) => (
          <motion.div key={exp.id} className="glass rounded-xl p-5 border border-white/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-white">{exp.role}</h3>
                <p className="text-sm text-purple-400">{exp.company}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-1">
                  {exp.duration && <span>{exp.duration}</span>}
                  {exp.location && <span>· {exp.location}</span>}
                </div>
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">{t}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"><FiEdit2 size={14} /></button>
                <button onClick={() => handleDelete(exp.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={14} /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {experience.length === 0 && !showForm && <div className="text-center py-12 text-gray-500 text-sm">No experience entries yet.</div>}
    </div>
  );
}
