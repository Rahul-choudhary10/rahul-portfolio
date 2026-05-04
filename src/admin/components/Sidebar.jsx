import { motion } from 'framer-motion';
import {
  FiGrid, FiUser, FiCode, FiBriefcase, FiFolder,
  FiAward, FiLink, FiMessageSquare, FiLogOut,
} from 'react-icons/fi';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <FiGrid size={18} /> },
  { id: 'personalInfo', label: 'Personal Info', icon: <FiUser size={18} /> },
  { id: 'skills', label: 'Skills', icon: <FiCode size={18} /> },
  { id: 'experience', label: 'Experience', icon: <FiBriefcase size={18} /> },
  { id: 'projects', label: 'Projects', icon: <FiFolder size={18} /> },
  { id: 'certifications', label: 'Certifications', icon: <FiAward size={18} /> },
  { id: 'socialLinks', label: 'Social Links', icon: <FiLink size={18} /> },
  { id: 'messages', label: 'Messages', icon: <FiMessageSquare size={18} /> },
];

export default function Sidebar({ activeSection, setActiveSection, onLogout, user }) {
  return (
    <div className="w-full h-full flex flex-col bg-[#0a0f1e] border-r border-white/5">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="font-mono font-bold text-lg flex items-center gap-1">
          <span className="text-purple-400">&lt;</span>
          <span className="gradient-text">Admin</span>
          <span className="text-blue-400">/&gt;</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-white/5">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">Admin</div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              whileHover={{ x: isActive ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={isActive ? 'text-purple-400' : ''}>{item.icon}</span>
              {item.label}
              {isActive && (
                <motion.div
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                  layoutId="activeDot"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/5">
        <motion.button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          whileHover={{ x: 3 }}
        >
          <FiLogOut size={18} />
          Sign Out
        </motion.button>
      </div>
    </div>
  );
}
