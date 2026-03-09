interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'link';
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  fullWidth = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-all';

  const variants = {
    primary: `
      bg-gradient-primary text-white py-4 px-6
      hover:opacity-90 active:shadow-glow-cyan
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-white/10 text-white py-3 px-6
      hover:bg-white/20
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    link: `
      text-white underline hover:text-accent-cyan
      disabled:opacity-50
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
