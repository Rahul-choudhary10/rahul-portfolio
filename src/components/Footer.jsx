import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';
import { useFirstDocument } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';

export default function Footer() {
  const { isDark } = useTheme();
  const { data: personalInfo } = useFirstDocument('personalInfo');
  const { data: socialLinks } = useFirstDocument('socialLinks');

  const name = personalInfo?.name || 'Rahul Kumar Choudhary';
  const year = new Date().getFullYear();

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={`relative py-12 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono font-bold text-xl flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-purple-400">&lt;</span>
            <span className="gradient-text">RKC</span>
            <span className="text-blue-400">/&gt;</span>
          </motion.button>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-4">
            {navLinks.map((link) => (
              <motion.button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`text-sm transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-700'}`}
                whileHover={{ y: -1 }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            {socialLinks?.github && (
              <SocialLink href={socialLinks.github} icon={<FiGithub size={18} />} isDark={isDark} />
            )}
            {socialLinks?.linkedin && (
              <SocialLink href={socialLinks.linkedin} icon={<FiLinkedin size={18} />} isDark={isDark} />
            )}
            {socialLinks?.email && (
              <SocialLink href={`mailto:${socialLinks.email}`} icon={<FiMail size={18} />} isDark={isDark} />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className={`my-8 h-px ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            © {year} {name}. All rights reserved.
          </p>
          <p className={`flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Built with
            <FiHeart size={13} className="text-red-400 fill-red-400" />
            using React & Firebase
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon, isDark }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`p-2 rounded-lg transition-all ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  );
}
