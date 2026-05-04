import { motion } from 'framer-motion';
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useCollection } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';

const FALLBACK_EXPERIENCE = [
  {
    id: '1',
    company: 'Wipro',
    role: 'Software Developer',
    duration: 'Jan 2022 – Present',
    location: 'Bengaluru, India',
    description: 'Working as a Java Full Stack Developer, building enterprise-grade applications using Spring Boot, React, and microservices architecture. Responsible for designing and implementing RESTful APIs and frontend modules.',
    technologies: ['Java', 'Spring Boot', 'React', 'MySQL', 'Docker', 'AWS'],
    order: 1,
  },
];

export default function Experience() {
  const { isDark } = useTheme();
  const { data: experience, loading } = useCollection('experience', 'order');

  const displayExp = experience.length > 0 ? experience : FALLBACK_EXPERIENCE;

  return (
    <section id="experience" className={`py-24 relative ${isDark ? '' : 'bg-white/50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">Career Path</span>
          <h2 className="section-heading mt-2">
            Work <span className="gradient-text">Experience</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500 via-blue-500 to-transparent transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {displayExp.map((exp, index) => (
              <ExperienceItem
                key={exp.id}
                exp={exp}
                index={index}
                isDark={isDark}
                isEven={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ exp, index, isDark, isEven }) {
  return (
    <motion.div
      className={`relative flex flex-col md:flex-row gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Dot on timeline */}
      <div className="absolute left-4 md:left-1/2 top-6 transform md:-translate-x-1/2 -translate-x-1/2 z-10">
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-purple-400 bg-[#020817]"
          style={{ boxShadow: '0 0 12px rgba(168,85,247,0.6)' }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
        />
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden md:block flex-1" />

      {/* Card */}
      <div className="flex-1 ml-10 md:ml-0">
        <motion.div
          className={`rounded-2xl p-6 glass ${isDark ? 'hover:neon-border' : 'border border-gray-200 hover:border-purple-300 shadow-lg'} transition-all duration-300`}
          whileHover={{ y: -4 }}
        >
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{exp.role}</h3>
              <div className="flex items-center gap-2 mt-1">
                <FiBriefcase size={14} className="text-purple-400" />
                <span className="text-purple-400 font-semibold text-sm">{exp.company}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-sm">
              <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <FiCalendar size={13} />
                <span className="font-mono">{exp.duration}</span>
              </div>
              {exp.location && (
                <div className={`flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <FiMapPin size={13} />
                  <span>{exp.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {exp.description && (
            <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {exp.description}
            </p>
          )}

          {/* Tech stack */}
          {exp.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                    isDark
                      ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
