import React from 'react';
import { VerseReference } from '../types';

interface VerseDisplayProps {
  data: VerseReference | null;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full max-w-3xl mx-auto text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h2 className="text-bible-gold text-lg md:text-xl font-bold tracking-widest uppercase mb-2">
        {data.book} {data.chapter}:{data.verse}
      </h2>
      <div className="relative">
        <span className="absolute -top-4 -left-2 text-6xl text-bible-gold/20 font-serif">“</span>
        <p className="text-2xl md:text-4xl leading-relaxed font-serif text-slate-100 py-4">
          {data.text}
        </p>
        <span className="absolute -bottom-8 -right-2 text-6xl text-bible-gold/20 font-serif rotate-180">“</span>
      </div>
    </div>
  );
};

export default VerseDisplay;