import { Edit2 } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onEdit?: () => void;
  showEdit?: boolean;
}

export default function Card({
  children,
  className = '',
  title,
  onEdit,
  showEdit = false,
}: CardProps) {
  return (
    <div className={`bg-surface-card border border-border-card rounded-2xl p-5 backdrop-blur ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          {showEdit && onEdit && (
            <button
              onClick={onEdit}
              className="text-white hover:text-accent-cyan transition-colors"
            >
              <Edit2 size={20} />
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
