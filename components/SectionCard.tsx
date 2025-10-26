
import React from 'react';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-brand-secondary rounded-xl shadow-lg overflow-hidden h-full">
      <div className="p-5">
        <h2 className="text-xl font-bold text-brand-primary mb-4 border-b-2 border-brand-primary/20 pb-2">{title}</h2>
        {children}
      </div>
    </div>
  );
};
