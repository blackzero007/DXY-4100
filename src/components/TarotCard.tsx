import { useEffect, useState } from 'react';
import type { DrawnCard } from '@/types';
import { playSound } from '@/utils/soundManager';

interface TarotCardProps {
  card: DrawnCard | null;
  isFlipping: boolean;
  onClick: () => void;
  disabled?: boolean;
}

interface Particle {
  id: number;
  left: string;
  top: string;
  animationClass: string;
  delay: string;
  size: number;
}

const particleAnimations = [
  'animate-particle-top-left',
  'animate-particle-top-right',
  'animate-particle-bottom-left',
  'animate-particle-bottom-right',
  'animate-particle-left-up',
  'animate-particle-right-up',
];

function generateParticles(): Particle[] {
  const particles: Particle[] = [];
  const positions = [
    { left: '10%', top: '5%' },
    { left: '30%', top: '3%' },
    { left: '50%', top: '2%' },
    { left: '70%', top: '3%' },
    { left: '90%', top: '5%' },
    { left: '5%', top: '20%' },
    { left: '95%', top: '20%' },
    { left: '3%', top: '50%' },
    { left: '97%', top: '50%' },
    { left: '5%', top: '80%' },
    { left: '95%', top: '80%' },
    { left: '10%', top: '95%' },
    { left: '30%', top: '97%' },
    { left: '50%', top: '98%' },
    { left: '70%', top: '97%' },
    { left: '90%', top: '95%' },
  ];

  positions.forEach((pos, index) => {
    const animationIndex = index % particleAnimations.length;
    particles.push({
      id: index,
      left: pos.left,
      top: pos.top,
      animationClass: particleAnimations[animationIndex],
      delay: `${Math.random() * 0.3}s`,
      size: 4 + Math.random() * 6,
    });
  });

  for (let i = 0; i < 8; i++) {
    particles.push({
      id: positions.length + i,
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      animationClass: particleAnimations[Math.floor(Math.random() * particleAnimations.length)],
      delay: `${0.2 + Math.random() * 0.5}s`,
      size: 3 + Math.random() * 5,
    });
  }

  return particles;
}

export default function TarotCardComponent({
  card,
  isFlipping,
  onClick,
  disabled = false,
}: TarotCardProps) {
  const isFlipped = card !== null || isFlipping;
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      setParticles(generateParticles());
      setShowParticles(true);
    }
  }, [isFlipping]);

  const handleClick = () => {
    if (disabled) return;
    playSound('cardFlip');
    onClick();
  };

  return (
    <div
      className={`relative w-64 h-96 sm:w-72 sm:h-[28rem] perspective-1000 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      }`}
      onClick={disabled ? undefined : handleClick}
    >
      {showParticles && (
        <div className="particles-container">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`gold-particle ${particle.animationClass}`}
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.delay,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            />
          ))}
        </div>
      )}
      <div
        className={`relative w-full h-full transition-transform duration-1500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        } ${isFlipping ? 'animate-shuffle' : ''}`}
      >
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl">
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 flex items-center justify-center border-4 border-amber-500/60">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-8 left-8 w-16 h-16 border-2 border-amber-400/40 rounded-full" />
              <div className="absolute bottom-8 right-8 w-20 h-20 border-2 border-amber-400/40 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-amber-400/30 rotate-45" />
            </div>
            <div className="relative z-10 flex flex-col items-center gap-4">
              <span className="text-6xl">🂠</span>
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <p className="text-amber-300/80 text-sm tracking-widest font-serif">
                TAROT
              </p>
            </div>
            <div className="absolute top-4 left-4 text-amber-400/50 text-xl">
              ✦
            </div>
            <div className="absolute top-4 right-4 text-amber-400/50 text-xl">
              ✦
            </div>
            <div className="absolute bottom-4 left-4 text-amber-400/50 text-xl">
              ✦
            </div>
            <div className="absolute bottom-4 right-4 text-amber-400/50 text-xl">
              ✦
            </div>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl">
          {card ? (
            <div
              className={`w-full h-full bg-gradient-to-br ${card.color} flex flex-col items-center justify-center p-6 border-4 border-amber-400/60 ${card.isReversed ? 'rotate-180' : ''}`}
            >
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute top-3 left-3 text-white/70 text-xs font-serif">
                {card.nameEn}
              </div>
              <div className="absolute top-3 right-3 text-white/70 text-xs font-serif">
                {card.nameEn}
              </div>
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="text-7xl sm:text-8xl drop-shadow-lg">
                  {card.symbol}
                </div>
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif drop-shadow-lg">
                    {card.name}
                  </h2>
                  <p className="text-white/70 text-sm mt-1 font-serif italic">
                    {card.nameEn}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 text-white/70 text-xs font-serif rotate-180">
                {card.nameEn}
              </div>
              <div className="absolute bottom-3 right-3 text-white/70 text-xs font-serif rotate-180">
                {card.nameEn}
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-800 via-indigo-800 to-purple-900 flex items-center justify-center">
              <div className="text-4xl text-amber-400/50 animate-pulse">✦</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
