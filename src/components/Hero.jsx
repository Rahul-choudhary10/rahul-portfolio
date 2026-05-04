import { useState } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { FiArrowDown, FiGithub, FiLinkedin, FiMail, FiDownload } from 'react-icons/fi';
import { useFirstDocument } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';
import defaultProfileImage from '../assets/rahul-profile.png';

export default function Hero() {
  const { isDark } = useTheme();
  const { data: personalInfo } = useFirstDocument('personalInfo');
  const { data: socialLinks } = useFirstDocument('socialLinks');

  const name = personalInfo?.name || 'Rahul Kumar Choudhary';
  const roles = personalInfo?.roles || [
    'Software Developer',
    'Java Full Stack Developer',
    'Backend Engineer',
    'React Developer',
  ];
  const intro = personalInfo?.intro || 'Building scalable and impactful web applications with modern technologies.';
  const resumeUrl = personalInfo?.resumeUrl || '#';

  const typingSequence = roles.flatMap((r) => [r, 2000]);

  const scrollToSection = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(168,85,247,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 py-20">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border"
              style={{ background: 'rgba(168,85,247,0.1)', borderColor: 'rgba(168,85,247,0.3)', color: '#a855f7' }}>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              Available for opportunities
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hi, I'm{' '}
            <span className="gradient-text block sm:inline">{name.split(' ')[0]}</span>
          </motion.h1>

          <motion.div
            className="text-2xl sm:text-3xl font-semibold mb-6 h-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {'< '}
            </span>
            <TypeAnimation
              sequence={typingSequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-purple-400"
            />
            <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
              {' />'}
            </span>
          </motion.div>

          <motion.p
            className={`text-lg max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {intro}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={() => scrollToSection('#projects')}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.button>

            {resumeUrl && resumeUrl !== '#' && (
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiDownload size={16} />
                Download CV
              </motion.a>
            )}

            <motion.button
              onClick={() => scrollToSection('#contact')}
              className={`px-6 py-3 rounded-xl font-semibold border transition-all duration-300 ${
                isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact Me
            </motion.button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {socialLinks?.github && (
              <SocialIcon href={socialLinks.github} icon={<FiGithub size={20} />} label="GitHub" isDark={isDark} />
            )}
            {socialLinks?.linkedin && (
              <SocialIcon href={socialLinks.linkedin} icon={<FiLinkedin size={20} />} label="LinkedIn" isDark={isDark} />
            )}
            {socialLinks?.email && (
              <SocialIcon href={`mailto:${socialLinks.email}`} icon={<FiMail size={20} />} label="Email" isDark={isDark} />
            )}
          </motion.div>
        </div>

        {/* Avatar / Code Card */}
        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid transparent', backgroundClip: 'padding-box' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full" style={{
                background: 'conic-gradient(from 0deg, #a855f7, #3b82f6, #06b6d4, #a855f7)',
                WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black 0)',
                mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), black 0)',
              }} />
            </motion.div>

            {/* Avatar placeholder */}
            <div className="absolute inset-4 rounded-full glass neon-border flex items-center justify-center overflow-hidden">
              <ProfileImage
                src={personalInfo?.profileImage || defaultProfileImage}
                alt={name}
                initials={name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              />
            </div>

            {/* Floating badges */}
            <motion.div
              className="absolute -top-4 -right-4 glass px-3 py-1.5 rounded-full text-xs font-mono text-purple-400 neon-border"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Java ☕
            </motion.div>
            <motion.div
              className="absolute -bottom-4 -left-4 glass px-3 py-1.5 rounded-full text-xs font-mono text-blue-400"
              style={{ border: '1px solid rgba(59,130,246,0.3)' }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            >
              React ⚛️
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-purple-400 transition-colors"
        onClick={() => scrollToSection('#about')}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <FiArrowDown size={16} />
      </motion.button>
    </section>
  );
}

function SocialIcon({ href, icon, label, isDark }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`p-2.5 rounded-lg transition-all duration-200 ${
        isDark ? 'text-gray-400 hover:text-white border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10' : 'text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-purple-400 hover:bg-purple-50'
      }`}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
    </motion.a>
  );
}

function ProfileImage({ src, alt, initials }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 w-full h-full">
        <div className="text-5xl font-bold gradient-text font-mono">{initials}</div>
        <div className="text-xs text-gray-400 mt-2 font-mono">Full Stack Dev</div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover rounded-full"
      onError={() => setFailed(true)}
    />
  );
}
