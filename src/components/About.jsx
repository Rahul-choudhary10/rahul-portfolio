import { motion } from 'framer-motion';
import { FiCode, FiServer, FiZap } from 'react-icons/fi';
import { useFirstDocument } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';

const highlights = [
  { icon: <FiCode size={24} />, label: 'Frontend', color: 'from-purple-500 to-pink-500' },
  { icon: <FiServer size={24} />, label: 'Backend', color: 'from-blue-500 to-cyan-500' },
  { icon: <FiZap size={24} />, label: 'Agile', color: 'from-amber-500 to-orange-500' },
];

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' },
  }),
};

export default function About() {
  const { isDark } = useTheme();
  const { data: personalInfo, loading } = useFirstDocument('personalInfo');

  const name = personalInfo?.name || 'Rahul Kumar Choudhary';
  const role = personalInfo?.role || 'Software Developer | Java Full Stack Developer';
  const company = personalInfo?.company || 'Wipro';
  const about = personalInfo?.about || `I'm a passionate Software Developer with expertise in Java Full Stack development, currently working at ${company}. I specialize in building robust, scalable web applications using modern technologies including Java, Spring Boot, React, and cloud services.`;
  const location = personalInfo?.location || 'India';
  const experience = personalInfo?.yearsOfExperience || '2+';

  return (
    <section id="about" className={`py-24 relative ${isDark ? '' : 'bg-white/50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Who I Am</span>
          <h2 className="section-heading mt-2">
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Visual */}
          <motion.div
            className="relative"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            custom={0}
            viewport={{ once: true }}
          >
            <div className={`relative rounded-2xl p-8 glass ${isDark ? 'neon-border' : 'border border-gray-200 shadow-xl'}`}>
              {/* Code snippet style display */}
              <div className="font-mono text-sm">
                <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className={`ml-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>about.json</span>
                </div>
                <div className="space-y-2">
                  <div><span className="text-blue-400">{'{'}</span></div>
                  <CodeLine label="name" value={name} color="text-green-400" />
                  <CodeLine label="role" value={role} color="text-yellow-400" />
                  <CodeLine label="company" value={company} color="text-purple-400" />
                  <CodeLine label="location" value={location} color="text-cyan-400" />
                  <CodeLine label="experience" value={`${experience} years`} color="text-pink-400" />
                  <CodeLine label="status" value="Open to work" color="text-green-400" isLast />
                  <div><span className="text-blue-400">{'}'}</span></div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: `${experience}+`, label: 'Years Exp.' },
                { value: '10+', label: 'Projects' },
                { value: '5+', label: 'Certifications' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className={`rounded-xl p-4 text-center glass ${isDark ? '' : 'border border-gray-200'}`}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  custom={i * 0.1}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Text */}
          <div className="space-y-6">
            <motion.p
              className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              custom={0.1}
              viewport={{ once: true }}
            >
              {about}
            </motion.p>

            {/* Highlight cards */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  className={`rounded-xl p-4 text-center glass ${isDark ? '' : 'border border-gray-200'}`}
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  custom={i * 0.15}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${h.color} text-white mb-2`}>
                    {h.icon}
                  </div>
                  <div className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{h.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              custom={0.4}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary mt-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's work together →
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CodeLine({ label, value, color, isLast }) {
  return (
    <div className="pl-4 flex gap-2 flex-wrap">
      <span className="text-gray-500">"{label}"</span>
      <span className="text-gray-400">:</span>
      <span className={color}>"{value}"</span>
      {!isLast && <span className="text-gray-400">,</span>}
    </div>
  );
}
