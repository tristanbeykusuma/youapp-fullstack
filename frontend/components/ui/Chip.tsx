import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  removable?: boolean;
}

export default function Chip({ label, onRemove, removable = true }: ChipProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.22] rounded-full px-4 py-2 text-white text-sm">
      <span>{label}</span>
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="hover:opacity-70 transition-opacity"
          type="button"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
