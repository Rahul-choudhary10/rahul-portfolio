import { useCollection, useDocument } from '../../hooks/useFirestore';
import { FiUsers, FiCode, FiBriefcase, FiFolder, FiAward, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function StatsOverview() {
  const { data: skills } = useCollection('skills');
  const { data: experience } = useCollection('experience');
  const { data: projects } = useCollection('projects');
  const { data: certs } = useCollection('certifications');
  const { data: messages } = useCollection('messages');
  const { data: personalInfo } = useDocument('personalInfo', 'main');

  const unreadMessages = messages.filter((m) => !m.read).length;

  const stats = [
    { label: 'Skills', value: skills.length, icon: <FiCode size={20} />, color: 'from-purple-500 to-pink-500' },
    { label: 'Experience', value: experience.length, icon: <FiBriefcase size={20} />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Projects', value: projects.length, icon: <FiFolder size={20} />, color: 'from-amber-500 to-orange-500' },
    { label: 'Certifications', value: certs.length, icon: <FiAward size={20} />, color: 'from-green-500 to-emerald-500' },
    { label: 'Messages', value: messages.length, icon: <FiMessageSquare size={20} />, color: 'from-red-500 to-rose-500', badge: unreadMessages },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome back, <span className="gradient-text">{personalInfo?.name?.split(' ')[0] || 'Admin'}</span> 👋
        </h2>
        <p className="text-gray-400 text-sm mt-1">Here's an overview of your portfolio content.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -2 }}
          >
            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-3`}>
              {stat.icon}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              {stat.badge > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/20">
                  {stat.badge} new
                </span>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick tips */}
      <div className="glass rounded-xl p-6 border border-white/5">
        <h3 className="font-semibold text-white mb-4">Quick Start Guide</h3>
        <ul className="space-y-3 text-sm text-gray-400">
          {[
            ['Personal Info', 'Update your name, role, bio, and resume link'],
            ['Skills', 'Add skills with proficiency levels and categories'],
            ['Projects', 'Showcase your work with GitHub and live links'],
            ['Messages', 'Check contact form submissions from visitors'],
          ].map(([section, desc]) => (
            <li key={section} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
              <span>
                <span className="text-white font-medium">{section}:</span> {desc}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
