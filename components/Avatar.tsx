import React, { useState } from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  /** Accepts a pixel number (e.g. 132) or any CSS size value (e.g. 'clamp(12rem, 24vw, 18rem)') for responsive sizing. */
  size?: number | string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 160, className = '' }) => {
  const [errored, setErrored] = useState(!src);
  const dimension = typeof size === 'number' ? `${size}px` : size;
  const fontSize = `calc(${dimension} * 0.32)`;

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-accent/5 border border-accent/30 text-accent font-serif font-semibold shrink-0 ${className}`}
        style={{ width: dimension, height: dimension, fontSize }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setErrored(true)}
      className={`rounded-full object-cover border border-border shrink-0 ${className}`}
      style={{ width: dimension, height: dimension }}
    />
  );
};
