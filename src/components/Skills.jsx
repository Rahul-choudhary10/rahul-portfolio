import { motion } from 'framer-motion';
import { useCollection } from '../hooks/useFirestore';
import { useTheme } from '../context/ThemeContext';

const categoryColors = {
  frontend: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  backend: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-400', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  database: { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  tools: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  devops: { bg: 'from-red-500 to-rose-500', text: 'text-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
};

const categoryLabels = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools & Others',
  devops: 'DevOps',
};

const FALLBACK_SKILLS = [
  { id: '1', name: 'Java', category: 'backend', level: 90 },
  { id: '2', name: 'Spring Boot', category: 'backend', level: 85 },
  { id: '3', name: 'React', category: 'frontend', level: 82 },
  { id: '4', name: 'JavaScript', category: 'frontend', level: 85 },
  { id: '5', name: 'MySQL', category: 'database', level: 80 },
  { id: '6', name: 'Git', category: 'tools', level: 88 },
  { id: '7', name: 'Docker', category: 'devops', level: 70 },
  { id: '8', name: 'AWS', category: 'devops', level: 65 },
];

export default function Skills() {
  const { isDark } = useTheme();
  const { data: skills, loading } = useCollection('skills', 'order');

  const displaySkills = skills.length > 0 ? skills : FALLBACK_SKILLS;

  const grouped = displaySkills.reduce((acc, skill) => {
    const cat = skill.category || 'tools';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className={`py-24 relative ${isDark ? '' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400 font-mono text-sm tracking-widest uppercase">What I Know</span>
          <h2 className="section-heading mt-2">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className={`mt-4 text-base max-w-xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Technologies I've worked with across the full stack
          </p>
        </motion.div>

        {/* Skill categories */}
        <div className="space-y-10">
          {Object.entries(grouped).map(([category, catSkills], catIndex) => {
            const colors = categoryColors[category] || categoryColors.tools;
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                {/* Category label */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colors.badge}`}>
                    {categoryLabels[category] || category}
                  </span>
                  <div className={`flex-1 h-px ${isDark ? 'bg-white/5' : 'bg-gray-200'}`} />
                </div>

                {/* Skills grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {catSkills.map((skill, skillIndex) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      colors={colors}
                      isDark={isDark}
                      delay={skillIndex * 0.05}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillCard({ skill, colors, isDark, delay }) {
  const level = skill.level || 75;

  return (
    <motion.div
      className={`rounded-xl p-4 glass ${isDark ? 'hover:neon-border' : 'border border-gray-200 hover:border-purple-300'} transition-all duration-300 group`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {skill.name}
        </span>
        <span className={`text-xs font-mono ${colors.text}`}>{level}%</span>
      </div>

      {/* Progress bar */}
      <div className={`h-1.5 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-200'} overflow-hidden`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${colors.bg}`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
