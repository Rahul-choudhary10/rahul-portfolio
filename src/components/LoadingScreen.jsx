import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020817]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Orb blobs */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute w-[300px] h-[300px] bg-blue-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Logo animation */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Code brackets */}
        <div className="flex items-center gap-3 text-5xl font-mono font-bold">
          <motion.span
            className="text-purple-400"
            animate={{ x: [-10, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            &lt;
          </motion.span>
          <motion.span
            className="gradient-text text-4xl"
            animate={{ y: [10, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Rahul Kumar Choudhary
          </motion.span>
          <motion.span
            className="text-blue-400"
            animate={{ x: [10, 0], opacity: [0, 1] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            /&gt;
          </motion.span>
        </div>

        <motion.p
          className="text-gray-400 text-sm font-mono tracking-widest uppercase"
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          Loading Portfolio...
        </motion.p>

        {/* Progress bar */}
        <div className="w-48 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #a855f7, #3b82f6)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
