'use client'

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  href?: string;
}

export function Logo({ className, variant = 'light', size = 'md', clickable = true, href = 'https://aurum-plataforma.vercel.app/' }: LogoProps) {
  const sizeClasses = {
    sm: {
      width: 120,
      height: 60,
    },
    md: {
      width: 180,
      height: 90,
    },
    lg: {
      width: 300,
      height: 150,
    }
  };

  const currentSize = sizeClasses[size];

  const content = (
    <Image
      src="/aurum-logo.png"
      alt="AURUM NOVA ESCOLA"
      width={currentSize.width}
      height={currentSize.height}
      className="object-contain"
      priority
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      unoptimized
    />
  );

  if (!clickable) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      className={cn('flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity', className)}
      aria-label="Ir para a página inicial da AURUM"
    >
      {content}
    </a>
  );
}

