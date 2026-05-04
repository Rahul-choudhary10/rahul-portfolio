import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiGithub, FiLinkedin, FiMail, FiTwitter, FiGlobe, FiInstagram } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useDocument, firestoreSet } from '../../hooks/useFirestore';
import { SectionHeader, Loader } from './PersonalInfoManager';

const SOCIAL_FIELDS = [
  { name: 'github', label: 'GitHub URL', icon: <FiGithub />, placeholder: 'https://github.com/username' },
  { name: 'linkedin', label: 'LinkedIn URL', icon: <FiLinkedin />, placeholder: 'https://linkedin.com/in/username' },
  { name: 'email', label: 'Email Address', icon: <FiMail />, placeholder: 'rahul@example.com', type: 'email' },
  { name: 'twitter', label: 'Twitter / X URL', icon: <FiTwitter />, placeholder: 'https://twitter.com/username' },
  { name: 'instagram', label: 'Instagram URL', icon: <FiInstagram />, placeholder: 'https://instagram.com/username' },
  { name: 'website', label: 'Personal Website', icon: <FiGlobe />, placeholder: 'https://yourwebsite.com', type: 'url' },
];

const EMPTY_FORM = SOCIAL_FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});

export default function SocialLinksManager() {
  const { data, loading } = useDocument('socialLinks', 'main');
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm({ ...EMPTY_FORM, ...data });
  }, [data]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await firestoreSet('socialLinks', 'main', form);
      toast.success('Social links saved!');
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-xl space-y-6">
      <SectionHeader title="Social Links" subtitle="Manage your public social media profiles" />

      <form onSubmit={handleSave} className="glass rounded-2xl p-6 border border-white/5 space-y-4">
        {SOCIAL_FIELDS.map((field) => (
          <div key={field.name}>
            <label className="admin-label flex items-center gap-1.5">
              <span className="text-purple-400">{field.icon}</span>
              {field.label}
            </label>
            <input
              type={field.type || 'text'}
              placeholder={field.placeholder}
              value={form[field.name] || ''}
              onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
              className="admin-input"
            />
          </div>
        ))}

        <motion.button
          type="submit"
          disabled={saving}
          className="w-full btn-primary flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
          whileHover={{ scale: saving ? 1 : 1.02 }}
          whileTap={{ scale: saving ? 1 : 0.98 }}
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
          ) : (
            <><FiSave size={15} />Save Links</>
          )}
        </motion.button>
      </form>
    </div>
  );
}
