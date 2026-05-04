import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCollection, firestoreAdd, firestoreUpdate, firestoreDelete } from '../../hooks/useFirestore';
import { SectionHeader, Loader } from './PersonalInfoManager';

const EMPTY_FORM = { title: '', issuer: '', date: '', credentialUrl: '', image: '', order: 0 };

export default function CertificationsManager() {
  const { data: certs, loading } = useCollection('certifications', 'order');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openAdd = () => { setForm({ ...EMPTY_FORM, order: certs.length }); setEditingId(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({ title: c.title || '', issuer: c.issuer || '', date: c.date || '', credentialUrl: c.credentialUrl || '', image: c.image || '', order: c.order || 0 });
    setEditingId(c.id); setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingId(null); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Title is required.'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await firestoreUpdate('certifications', editingId, { ...form, order: Number(form.order) });
        toast.success('Certification updated!');
      } else {
        await firestoreAdd('certifications', { ...form, order: Number(form.order) });
        toast.success('Certification added!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try { await firestoreDelete('certifications', id); toast.success('Deleted.'); } catch (err) { toast.error(err.message); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Certifications" subtitle={`${certs.length} certification${certs.length !== 1 ? 's' : ''}`} />
        <motion.button onClick={openAdd} className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <FiPlus size={16} /> Add
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div className="glass rounded-2xl p-6 border border-purple-500/20" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{editingId ? 'Edit Certification' : 'Add Certification'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-white"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="admin-label">Certification Title *</label>
                <input className="admin-input" placeholder="AWS Certified Solutions Architect" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Issuing Organization</label>
                <input className="admin-input" placeholder="Amazon Web Services" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Date / Year</label>
                <input className="admin-input" placeholder="2023" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Credential URL</label>
                <input className="admin-input" type="url" placeholder="https://..." value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Badge Image URL</label>
                <input className="admin-input" type="url" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
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

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert) => (
          <motion.div key={cert.id} className="glass rounded-xl p-5 border border-white/5 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} layout>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><FiAward size={18} /></div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(cert)} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"><FiEdit2 size={13} /></button>
                <button onClick={() => handleDelete(cert.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={13} /></button>
              </div>
            </div>
            <h3 className="font-semibold text-white text-sm mt-1 leading-snug">{cert.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{cert.issuer}</p>
            <p className="text-xs text-gray-600 mt-1 font-mono">{cert.date}</p>
            {cert.credentialUrl && (
              <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300 mt-auto pt-2 transition-colors">View Credential →</a>
            )}
          </motion.div>
        ))}
      </div>
      {certs.length === 0 && !showForm && <div className="text-center py-12 text-gray-500 text-sm">No certifications yet.</div>}
    </div>
  );
}
