import { FcGoogle } from 'react-icons/fc';

interface Props {
  onClick: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export function GoogleButton({ onClick, loading, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-dark-600 hover:bg-dark-500 rounded-xl transition-all duration-300 font-ui text-white border border-dark-300 hover:border-accent-400 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FcGoogle size={24} className="filter brightness-150" />
      {children || 'Continue with Google'}
    </button>
  );
} 