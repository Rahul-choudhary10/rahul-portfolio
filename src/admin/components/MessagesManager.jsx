import { motion } from 'framer-motion';
import { FiTrash2, FiMail, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCollection, firestoreDelete, firestoreUpdate } from '../../hooks/useFirestore';
import { SectionHeader, Loader } from './PersonalInfoManager';

export default function MessagesManager() {
  const { data: messages, loading } = useCollection('messages');

  const sorted = [...messages].sort((a, b) => {
    const tA = a.timestamp?.toMillis?.() || 0;
    const tB = b.timestamp?.toMillis?.() || 0;
    return tB - tA;
  });

  const unread = sorted.filter((m) => !m.read).length;

  const handleMarkRead = async (id) => {
    try {
      await firestoreUpdate('messages', id, { read: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await firestoreDelete('messages', id); toast.success('Message deleted.'); }
    catch (err) { toast.error(err.message); }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader
          title="Messages"
          subtitle={`${messages.length} total · ${unread} unread`}
        />
        {unread > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/20 font-medium">
            {unread} new
          </span>
        )}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16 text-gray-500 text-sm">
          <FiMail size={32} className="mx-auto mb-3 opacity-30" />
          No messages yet.
        </div>
      )}

      <div className="space-y-3">
        {sorted.map((msg) => (
          <MessageCard
            key={msg.id}
            msg={msg}
            onMarkRead={() => handleMarkRead(msg.id)}
            onDelete={() => handleDelete(msg.id)}
          />
        ))}
      </div>
    </div>
  );
}

function MessageCard({ msg, onMarkRead, onDelete }) {
  const ts = msg.timestamp?.toDate?.() || null;
  const timeStr = ts
    ? ts.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Just now';

  return (
    <motion.div
      className={`glass rounded-xl p-5 border transition-all ${msg.read ? 'border-white/5' : 'border-purple-500/20 bg-purple-500/3'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">{msg.name || 'Anonymous'}</span>
            {!msg.read && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-purple-500/20 text-purple-300 border border-purple-500/20">New</span>
            )}
          </div>

          {/* Email */}
          <a href={`mailto:${msg.email}`} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            {msg.email}
          </a>

          {/* Subject */}
          {msg.subject && (
            <p className="text-sm font-medium text-gray-300 mt-2">{msg.subject}</p>
          )}

          {/* Message body */}
          <p className="text-sm text-gray-400 mt-1 leading-relaxed whitespace-pre-wrap">{msg.message}</p>

          {/* Timestamp */}
          <div className="flex items-center gap-1 text-xs text-gray-600 mt-3">
            <FiClock size={11} />
            <span>{timeStr}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          {!msg.read && (
            <button
              onClick={onMarkRead}
              className="p-1.5 rounded-lg text-gray-400 hover:text-green-400 hover:bg-green-500/10 transition-all"
              title="Mark as read"
            >
              <FiCheck size={14} />
            </button>
          )}
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Delete"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
