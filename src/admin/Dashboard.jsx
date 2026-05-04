import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import PersonalInfoManager from './components/PersonalInfoManager';
import SkillsManager from './components/SkillsManager';
import ExperienceManager from './components/ExperienceManager';
import ProjectsManager from './components/ProjectsManager';
import CertificationsManager from './components/CertificationsManager';
import SocialLinksManager from './components/SocialLinksManager';
import MessagesManager from './components/MessagesManager';

const SECTION_MAP = {
  overview: StatsOverview,
  personalInfo: PersonalInfoManager,
  skills: SkillsManager,
  experience: ExperienceManager,
  projects: ProjectsManager,
  certifications: CertificationsManager,
  socialLinks: SocialLinksManager,
  messages: MessagesManager,
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
    } catch {
      toast.error('Logout failed.');
    }
  };

  const ActiveComponent = SECTION_MAP[activeSection] || StatsOverview;

  return (
    <div className="min-h-screen bg-[#020817] text-white flex">
      {/* Sidebar (desktop) */}
      <div className="hidden lg:flex w-64 flex-shrink-0">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onLogout={handleLogout}
          user={user}
        />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <Sidebar
                activeSection={activeSection}
                setActiveSection={(s) => { setActiveSection(s); setSidebarOpen(false); }}
                onLogout={handleLogout}
                user={user}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 sm:px-6 bg-[#020817]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="font-semibold text-sm capitalize">
                {activeSection === 'overview' ? 'Dashboard Overview' : activeSection.replace(/([A-Z])/g, ' $1').trim()}
              </h1>
              <p className="text-xs text-gray-500">Manage your portfolio content</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-xs text-gray-400 hover:text-purple-400 transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
            >
              View Portfolio →
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              <FiLogOut size={15} />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveComponent />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
