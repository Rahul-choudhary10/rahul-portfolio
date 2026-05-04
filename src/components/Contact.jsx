import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { firestoreAddMessage } from '../hooks/useFirestore';
import { useFirstDocument } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

export default function Contact() {
  const { isDark } = useTheme();
  const { data: personalInfo } = useFirstDocument('personalInfo');
  const { data: socialLinks } = useFirstDocument('socialLinks');
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const email = socialLinks?.email || personalInfo?.email || 'rahul@example.com';
  const phone = personalInfo?.phone || '';
  const location = personalInfo?.location || 'India';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await firestoreAddMessage(form);
      toast.success('Message sent! I\'ll get back to you soon. 🚀');
      setForm(INITIAL_FORM);
    } catch (err) {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className={`py-24 relative ${isDark ? '' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Let's Talk</span>
          <h2 className="section-heading mt-2">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className={`mt-4 text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left — Info */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ContactInfoCard icon={<FiMail />} label="Email" value={email} href={`mailto:${email}`} isDark={isDark} />
            {phone && <ContactInfoCard icon={<FiPhone />} label="Phone" value={phone} href={`tel:${phone}`} isDark={isDark} />}
            <ContactInfoCard icon={<FiMapPin />} label="Location" value={location} isDark={isDark} />

            {/* Availability badge */}
            <div className={`rounded-2xl p-6 glass ${isDark ? '' : 'border border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Available for work</span>
              </div>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                I'm currently open to new opportunities and freelance projects. Let's create something great together!
              </p>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form
              onSubmit={handleSubmit}
              className={`rounded-2xl p-8 glass ${isDark ? 'neon-border' : 'border border-gray-200 shadow-xl'}`}
            >
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <InputField
                  name="name"
                  label="Your Name *"
                  placeholder="Rahul Kumar"
                  value={form.name}
                  onChange={handleChange}
                  isDark={isDark}
                />
                <InputField
                  name="email"
                  label="Email Address *"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  isDark={isDark}
                />
              </div>
              <div className="mb-5">
                <InputField
                  name="subject"
                  label="Subject"
                  placeholder="Project Collaboration"
                  value={form.subject}
                  onChange={handleChange}
                  isDark={isDark}
                />
              </div>
              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Message *
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell me about your project or opportunity..."
                  value={form.message}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200 ${
                    isDark
                      ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:bg-white'
                  }`}
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend size={16} />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InputField({ name, label, type = 'text', placeholder, value, onChange, isDark }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 ${
          isDark
            ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500/50'
            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-400 focus:bg-white'
        }`}
      />
    </div>
  );
}

function ContactInfoCard({ icon, label, value, href, isDark }) {
  const content = (
    <motion.div
      className={`flex items-center gap-4 rounded-xl p-4 glass ${isDark ? '' : 'border border-gray-200'} transition-all`}
      whileHover={{ x: 4 }}
    >
      <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">{icon}</div>
      <div>
        <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</div>
        <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</div>
      </div>
    </motion.div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
