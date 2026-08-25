import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertCircle } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
  secretCode: string;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, secretCode }) => {
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!inputCode.trim()) {
      setError('Please enter the secret code');
      return;
    }

    setIsLoading(true);
    
    // Simulate a brief check (you can remove this delay if you want instant feedback)
    setTimeout(() => {
      if (inputCode === secretCode) {
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('authTimestamp', Date.now().toString());
        onSuccess();
      } else {
        setError('Invalid secret code. Access denied.');
        setIsLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background text-zinc-100 font-sans flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-8 md:p-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-zinc-600" />
            <Lock size={24} className="text-zinc-400" />
            <div className="h-[1px] w-12 bg-zinc-600" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
              ACCESS
            </span>
            {' '}REQUIRED
          </h1>

          <p className="text-zinc-400 font-mono text-sm text-center mb-8 tracking-wider">
            Enter the secret code to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="password"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  setError('');
                }}
                placeholder="Secret Code"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 text-zinc-100 font-mono text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all placeholder:text-zinc-600"
                autoFocus
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm font-mono"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-3 border border-zinc-600 text-zinc-300 font-mono text-xs tracking-widest hover:bg-zinc-800 hover:border-zinc-400 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Authenticate'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800">
            <p className="text-zinc-600 font-mono text-xs text-center">
              [SECURE CONNECTION]
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

