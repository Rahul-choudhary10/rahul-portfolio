import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiCode } from 'react-icons/fi';
import { useCollection } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';

const FALLBACK_PROJECTS = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce application with product management, cart, payment integration, and admin dashboard built with Spring Boot and React.',
    techStack: ['Java', 'Spring Boot', 'React', 'MySQL', 'JWT'],
    githubUrl: '#',
    liveUrl: '#',
    featured: true,
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Real-time task management system with drag-and-drop, team collaboration, and notification features.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    githubUrl: '#',
    liveUrl: '',
    featured: false,
  },
  {
    id: '3',
    title: 'REST API Gateway',
    description: 'Microservices API gateway with rate limiting, authentication, and load balancing built with Spring Cloud.',
    techStack: ['Java', 'Spring Cloud', 'Docker', 'Kubernetes'],
    githubUrl: '#',
    liveUrl: '',
    featured: false,
  },
];

const GRADIENT_PALETTES = [
  'from-purple-500/20 to-pink-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-amber-500/20 to-orange-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-red-500/20 to-rose-500/20',
  'from-indigo-500/20 to-violet-500/20',
];

export default function Projects() {
  const { isDark } = useTheme();
  const { data: projects, loading } = useCollection('projects', 'order');
  const [showAll, setShowAll] = useState(false);

  const displayProjects = projects.length > 0 ? projects : FALLBACK_PROJECTS;
  const visible = showAll ? displayProjects : displayProjects.slice(0, 6);

  return (
    <section id="projects" className={`py-24 relative ${isDark ? '' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">What I've Built</span>
          <h2 className="section-heading mt-2">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className={`mt-4 text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            A selection of projects I've built and contributed to
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {visible.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isDark={isDark}
                gradient={GRADIENT_PALETTES[index % GRADIENT_PALETTES.length]}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Show more */}
        {displayProjects.length > 6 && (
          <motion.div className="text-center mt-12">
            <motion.button
              onClick={() => setShowAll(!showAll)}
              className="btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showAll ? 'Show Less' : `Show All (${displayProjects.length})`}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, isDark, gradient }) {
  return (
    <motion.div
      className={`group rounded-2xl overflow-hidden glass ${isDark ? '' : 'border border-gray-200'} flex flex-col transition-all duration-300`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8, boxShadow: '0 25px 50px rgba(168,85,247,0.2)' }}
      layout
    >
      {/* Card Header with gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        {project.image ? (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FiCode size={32} className="text-white/50" />
            <span className="text-white/40 text-xs font-mono">no preview</span>
          </div>
        )}
        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/80 text-white backdrop-blur-sm">
            Featured
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
        <p className={`text-sm leading-relaxed flex-1 mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {project.description}
        </p>

        {/* Tech stack */}
        {project.techStack?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  isDark ? 'bg-white/5 text-gray-300 border border-white/10' : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 5 && (
              <span className={`px-2 py-0.5 rounded text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                +{project.techStack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <FiGithub size={15} />
              Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors ml-auto"
            >
              <FiExternalLink size={15} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
