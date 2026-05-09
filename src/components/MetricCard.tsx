import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  colorClass: string;
  progress?: number;
}

export default function MetricCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  colorClass,
  progress,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/30 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</span>
        {change !== undefined && (
          <span className={`text-[12px] font-bold flex items-center gap-1 ${
            changeType === 'up' ? 'text-secondary' : changeType === 'down' ? 'text-error' : 'text-on-surface-variant'
          }`}>
            {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-bold text-primary tracking-tight">{value}</h4>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>

      {progress !== undefined && (
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${changeType === 'up' ? 'bg-secondary' : changeType === 'down' ? 'bg-error' : 'bg-primary'}`}
          />
        </div>
      )}
    </motion.div>
  );
}
