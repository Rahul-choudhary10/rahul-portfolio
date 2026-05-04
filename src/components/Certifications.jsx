import { motion } from 'framer-motion';
import { FiAward, FiExternalLink } from 'react-icons/fi';
import { useCollection } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';

const FALLBACK_CERTS = [
  {
    id: '1',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023',
    credentialUrl: '#',
  },
  {
    id: '2',
    title: 'Java SE 11 Developer',
    issuer: 'Oracle',
    date: '2022',
    credentialUrl: '#',
  },
  {
    id: '3',
    title: 'Spring Professional',
    issuer: 'VMware',
    date: '2022',
    credentialUrl: '#',
  },
];

const CERT_COLORS = [
  { bg: 'from-purple-500/20 to-pink-500/20', icon: 'text-purple-400', border: 'border-purple-500/20' },
  { bg: 'from-blue-500/20 to-cyan-500/20', icon: 'text-blue-400', border: 'border-blue-500/20' },
  { bg: 'from-amber-500/20 to-orange-500/20', icon: 'text-amber-400', border: 'border-amber-500/20' },
  { bg: 'from-green-500/20 to-emerald-500/20', icon: 'text-green-400', border: 'border-green-500/20' },
];

export default function Certifications() {
  const { isDark } = useTheme();
  const { data: certs, loading } = useCollection('certifications', 'order');

  const displayCerts = certs.length > 0 ? certs : FALLBACK_CERTS;

  return (
    <section id="certifications" className={`py-24 relative ${isDark ? '' : 'bg-white/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Credentials</span>
          <h2 className="section-heading mt-2">
            <span className="gradient-text">Certifications</span>
          </h2>
          <p className={`mt-4 text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Professional certifications and achievements
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {displayCerts.map((cert, index) => {
            const palette = CERT_COLORS[index % CERT_COLORS.length];
            return (
              <motion.div
                key={cert.id}
                className={`group rounded-2xl p-6 glass ${isDark ? `border ${palette.border} hover:neon-border` : 'border border-gray-200 hover:border-purple-300'} transition-all duration-300`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${palette.bg} mb-4`}>
                  <FiAward size={24} className={palette.icon} />
                </div>

                {/* Title */}
                <h3 className={`font-bold text-base leading-snug mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {cert.title}
                </h3>

                {/* Issuer */}
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {cert.issuer}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <span className={`text-xs font-mono ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {cert.date}
                  </span>
                  {cert.credentialUrl && cert.credentialUrl !== '#' && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 text-xs transition-colors ${palette.icon} hover:opacity-80`}
                    >
                      <FiExternalLink size={12} />
                      View
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
