import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiGithub, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCollection, firestoreAdd, firestoreUpdate, firestoreDelete } from '../../hooks/useFirestore';
import { SectionHeader, Loader } from './PersonalInfoManager';

const EMPTY_FORM = {
  title: '', description: '', techStack: '',
  githubUrl: '', liveUrl: '', image: '',
  featured: false, order: 0,
};

export default function ProjectsManager() {
  const { data: projects, loading } = useCollection('projects', 'order');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm({ ...EMPTY_FORM, order: projects.length }); setEditingId(null); setShowForm(true); };
  const openEdit = (p) => {
    setForm({
      title: p.title || '', description: p.description || '',
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : p.techStack || '',
      githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '',
      image: p.image || '', featured: p.featured || false, order: p.order || 0,
    });
    setEditingId(p.id); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Project title is required.'); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack ? form.techStack.split(',').map((t) => t.trim()).filter(Boolean) : [],
        order: Number(form.order),
      };
      if (editingId) {
        await firestoreUpdate('projects', editingId, payload);
        toast.success('Project updated!');
      } else {
        await firestoreAdd('projects', payload);
        toast.success('Project added!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await firestoreDelete('projects', id); toast.success('Deleted.'); } catch (err) { toast.error(err.message); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Projects" subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`} />
        <motion.button onClick={openAdd} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiPlus size={16} /> Add Project
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div className="glass rounded-2xl p-6 border border-purple-500/20" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{editingId ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="admin-label">Title *</label>
                <input className="admin-input" placeholder="E-Commerce Platform" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Description</label>
                <textarea className="admin-input resize-none" rows={3} placeholder="Brief description of the project..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Tech Stack (comma-separated)</label>
                <input className="admin-input" placeholder="React, Spring Boot, MySQL, Docker" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">GitHub URL</label>
                <input className="admin-input" placeholder="https://github.com/..." type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Live Demo URL</label>
                <input className="admin-input" placeholder="https://..." type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Cover Image URL</label>
                <input className="admin-input" placeholder="https://..." type="url" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-purple-500 w-4 h-4" />
                <label htmlFor="featured" className="text-sm text-gray-300">Mark as Featured</label>
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

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => (
          <motion.div key={project.id} className="glass rounded-xl p-5 border border-white/5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-sm">{project.title}</h3>
                  {project.featured && <span className="px-1.5 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 border border-purple-500/20">Featured</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{project.description}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => openEdit(project)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"><FiEdit2 size={13} /></button>
                <button onClick={() => handleDelete(project.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={13} /></button>
              </div>
            </div>
            {project.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {project.techStack.slice(0, 4).map((t) => (
                  <span key={t} className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-gray-400 border border-white/10">{t}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"><FiGithub size={12} /> GitHub</a>}
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors"><FiExternalLink size={12} /> Live</a>}
            </div>
          </motion.div>
        ))}
      </div>
      {projects.length === 0 && !showForm && <div className="text-center py-12 text-gray-500 text-sm">No projects yet.</div>}
    </div>
  );
}
