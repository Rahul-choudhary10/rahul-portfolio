import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCollection, firestoreAdd, firestoreUpdate, firestoreDelete } from '../../hooks/useFirestore';
import { SectionHeader, Loader } from './PersonalInfoManager';

const CATEGORIES = ['frontend', 'backend', 'database', 'tools', 'devops'];

const EMPTY_FORM = { name: '', category: 'backend', level: 80, order: 0 };

export default function SkillsManager() {
  const { data: skills, loading } = useCollection('skills', 'order');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm({ ...EMPTY_FORM, order: skills.length }); setEditingId(null); setShowForm(true); };
  const openEdit = (skill) => { setForm({ name: skill.name, category: skill.category, level: skill.level, order: skill.order || 0 }); setEditingId(skill.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Skill name is required.'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await firestoreUpdate('skills', editingId, form);
        toast.success('Skill updated!');
      } else {
        await firestoreAdd('skills', form);
        toast.success('Skill added!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await firestoreDelete('skills', id);
      toast.success('Skill deleted.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader />;

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Skills" subtitle={`${skills.length} skill${skills.length !== 1 ? 's' : ''} total`} />
        <motion.button
          onClick={openAdd}
          className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus size={16} /> Add Skill
        </motion.button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="glass rounded-2xl p-6 border border-purple-500/20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="admin-label">Skill Name *</label>
                <input className="admin-input" placeholder="e.g. Java, React, Docker" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Category</label>
                <select className="admin-input" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0a0f1e]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="admin-label">Proficiency: {form.level}%</label>
                <input type="range" min={10} max={100} step={5} value={form.level}
                  onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                  className="w-full accent-purple-500 mt-2" />
              </div>
              <div>
                <label className="admin-label">Display Order</label>
                <input type="number" className="admin-input" value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end">
                <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition-all">Cancel</button>
                <motion.button type="submit" disabled={saving}
                  className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4 disabled:opacity-60"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiCheck size={15} />}
                  {editingId ? 'Update' : 'Add Skill'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills by category */}
      {CATEGORIES.map((cat) => grouped[cat]?.length > 0 && (
        <div key={cat}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3 capitalize">{cat}</h3>
          <div className="space-y-2">
            {grouped[cat].map((skill) => (
              <SkillRow key={skill.id} skill={skill} onEdit={() => openEdit(skill)} onDelete={() => handleDelete(skill.id)} />
            ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500 text-sm">No skills yet. Click "Add Skill" to get started.</div>
      )}
    </div>
  );
}

function SkillRow({ skill, onEdit, onDelete }) {
  return (
    <motion.div
      className="glass rounded-xl px-4 py-3 border border-white/5 flex items-center gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-white truncate">{skill.name}</span>
          <span className="text-xs font-mono text-purple-400 ml-2">{skill.level}%</span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: `${skill.level}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={onEdit} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"><FiEdit2 size={14} /></button>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={14} /></button>
      </div>
    </motion.div>
  );
}
