import { ComponentProps, forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends ComponentProps<'input'> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon: Icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-ui font-medium text-dark-100 mb-2 ml-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-200">
              <Icon size={20} />
            </div>
          )}
          <input
            ref={ref}
            className={`
              modern-input w-full font-ui text-base
              px-4 py-3 
              ${Icon ? 'pl-12' : 'pl-4'}
              bg-dark-800
              border border-dark-600
              focus:border-neon-500/50
              focus:ring-2 
              focus:ring-neon-500/20
              placeholder:text-dark-400
              transition-all
              duration-200
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500 ml-1">{error}</p>
        )}
      </div>
    );
  }
); 