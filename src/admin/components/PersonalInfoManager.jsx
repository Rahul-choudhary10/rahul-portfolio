import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiUpload, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useFirstDocument, firestoreSet } from '../../hooks/useFirestore';
import { useImageUpload } from '../../hooks/useImageUpload';
import defaultProfileImage from '../../assets/rahul-profile.png';

const FIELDS = [
  { name: 'name', label: 'Full Name', placeholder: 'Rahul Kumar Choudhary', required: true },
  { name: 'role', label: 'Professional Title', placeholder: 'Software Developer | Java Full Stack Developer', required: true },
  { name: 'company', label: 'Current Company', placeholder: 'Wipro' },
  { name: 'location', label: 'Location', placeholder: 'Bengaluru, India' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'rahul@example.com' },
  { name: 'phone', label: 'Phone', placeholder: '+91 XXXXXXXXXX' },
  { name: 'yearsOfExperience', label: 'Years of Experience', placeholder: '2' },
  { name: 'resumeUrl', label: 'Resume URL', placeholder: 'https://drive.google.com/...', type: 'url' },
];

const EMPTY_FORM = FIELDS.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {
  intro: '',
  about: '',
  roles: '',
  profileImage: '',
});

export default function PersonalInfoManager() {
  const { data, loading } = useFirstDocument('personalInfo');
  const { uploadImage, uploading, progress } = useImageUpload();
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (data) {
      setForm({
        ...EMPTY_FORM,
        ...data,
        roles: Array.isArray(data.roles) ? data.roles.join('\n') : data.roles || '',
      });
    }
  }, [data]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.loading('Uploading image...', { id: 'upload' });
      const url = await uploadImage(file, `profile/${Date.now()}_${file.name}`);
      setForm((prev) => ({ ...prev, profileImage: url }));
      toast.success('Image uploaded!', { id: 'upload' });
    } catch (err) {
      toast.error(err.message, { id: 'upload' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        roles: form.roles
          ? form.roles.split('\n').map((r) => r.trim()).filter(Boolean)
          : [],
      };
      await firestoreSet('personalInfo', 'main', payload);
      toast.success('Personal info saved!');
    } catch (err) {
      toast.error('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl space-y-6">
      <SectionHeader title="Personal Info" subtitle="Update your portfolio's core information" />

      <form onSubmit={handleSave} className="glass rounded-2xl p-6 border border-white/5 space-y-5">

        {/* Profile Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Profile Photo</label>
          <div className="flex items-center gap-5">
            {/* Preview */}
            <div className="w-20 h-20 rounded-full border-2 border-purple-500/30 overflow-hidden flex-shrink-0 bg-white/5 flex items-center justify-center">
              <img
                src={form.profileImage || defaultProfileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = defaultProfileImage; }}
              />
            </div>

            <div className="flex-1 space-y-2">
              {/* Upload button */}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-purple-500/30 text-purple-300 hover:bg-purple-500/10 transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiUpload size={14} />
                {uploading ? `Uploading ${progress}%...` : 'Upload Photo'}
              </motion.button>

              {/* Upload progress bar */}
              {uploading && (
                <div className="h-1 bg-white/5 rounded-full overflow-hidden w-full">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              )}

              <p className="text-xs text-gray-500">JPG, PNG or WEBP · Max 5 MB</p>
            </div>
          </div>

          {/* Manual URL input (optional) */}
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1.5">Or paste a direct image URL</p>
            <input
              type="text"
              name="profileImage"
              placeholder="https://..."
              value={form.profileImage || ''}
              onChange={handleChange}
              className="admin-input text-xs"
            />
          </div>
        </div>

        {/* Other fields */}
        {FIELDS.map((field) => (
          <FormField
            key={field.name}
            {...field}
            value={form[field.name] || ''}
            onChange={handleChange}
          />
        ))}

        {/* Intro */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Hero Intro</label>
          <p className="text-xs text-gray-500 mb-2">Short tagline shown in the hero section</p>
          <textarea name="intro" rows={2} placeholder="Building scalable and impactful web applications..."
            value={form.intro || ''} onChange={handleChange} className="admin-input resize-none" />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">About Me</label>
          <p className="text-xs text-gray-500 mb-2">Full bio shown in the About section</p>
          <textarea name="about" rows={5} placeholder="I'm a passionate Software Developer..."
            value={form.about || ''} onChange={handleChange} className="admin-input resize-none" />
        </div>

        {/* Roles */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Typing Animation Roles</label>
          <p className="text-xs text-gray-500 mb-2">One role per line — shown in the hero typing animation</p>
          <textarea name="roles" rows={4}
            placeholder={`Software Developer\nJava Full Stack Developer\nBackend Engineer`}
            value={form.roles || ''} onChange={handleChange} className="admin-input resize-none font-mono text-xs" />
        </div>

        <motion.button type="submit" disabled={saving}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
          whileHover={{ scale: saving ? 1 : 1.02 }} whileTap={{ scale: saving ? 1 : 0.98 }}>
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
            : <><FiSave size={15} />Save Changes</>}
        </motion.button>
      </form>
    </div>
  );
}

function FormField({ name, label, type = 'text', placeholder, required, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input type={type} name={name} placeholder={placeholder} value={value}
        onChange={onChange} required={required} className="admin-input" />
    </div>
  );
}

export function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

export function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
    </div>
  );
}
