import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface SisyphusProgressBarProps {
  /** External progress value between 0-100. If provided, component will be controlled. */
  progress?: number;
  /** Whether to show the percentage display. Default is true. */
  showPercentage?: boolean;
}

interface PhysicsState {
  boulderPosition: number;
  sisyphusPosition: number;
  boulderVelocity: number;
  targetPosition: number;
  phase: 'normal' | 'chasing' | 'pushing';
  animationPhase: number;
  rollTarget: number;
}

const SisyphusProgressBar: React.FC<SisyphusProgressBarProps> = ({ 
  progress: externalProgress, 
  showPercentage = true 
}) => {
  const [internalProgress, setInternalProgress] = useState<number>(50);
  const [physicsState, setPhysicsState] = useState<PhysicsState>({
    boulderPosition: 50,
    sisyphusPosition: 50,
    boulderVelocity: 0,
    targetPosition: 50,
    phase: 'normal', // 'normal', 'chasing', 'pushing'
    animationPhase: 0,
    rollTarget: 0,
  });
  
  // State for the rotating quotes
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const quoteRotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());

  const progress = externalProgress !== undefined ? externalProgress : internalProgress;

  // Authentic quotes from or inspired by "The Myth of Sisyphus"
  const quotes = [
      "The struggle itself toward the heights is enough to fill a man's heart.",
      "There is no fate that cannot be surmounted by scorn.",
      "The gods had thought with some reason that there is no more dreadful punishment than futile and hopeless labor.",
      "He was superior to his fate. He was stronger than his rock.",
      "His fate belongs to him. His rock is his thing.",
      "I leave Sisyphus at the foot of the mountain! One always finds one's burden again.",
      "The lucidity that was to constitute his torture at the same time crowns his victory."
  ];

  // Physics constants
  const PHYSICS = {
    gravity: 120,
    friction: 0.98,
    chaseSpeed: 80,
    pushSpeed: 25,
    moveSpeed: 40,
    initialVelocity: 20,
    rollAmount: 35, // The amount the boulder rolls down when progress is decreased manually
  };

  const getDisplayProgress = useCallback((sisyphusPos: number) => {
    const maxProgress = 95 + (sisyphusPos / 100) * 4.9;
    return Math.min(Math.max(0, sisyphusPos), maxProgress);
  }, []);

  const getPosition = useCallback((prog: number) => {
    const position = Math.max(0, Math.min(100, prog)) / 100;
    return {
      x: 10 + (position * 60),
      y: 95 - (position * 30)
    };
  }, []);

  // Update target when progress changes
  useEffect(() => {
    setPhysicsState(prev => ({ ...prev, targetPosition: progress }));
  }, [progress]);
  
  // Effect for rotating quotes when stagnant
  useEffect(() => {
      // Don't run this logic if the loader is controlled externally.
      if (externalProgress !== undefined) {
          if (quoteRotationIntervalRef.current) clearInterval(quoteRotationIntervalRef.current);
          return;
      }

      // Clear previous interval on each interaction to reset the timer
      if (quoteRotationIntervalRef.current) {
          clearInterval(quoteRotationIntervalRef.current);
      }

      // Set a new interval that rotates the quote every minute
      quoteRotationIntervalRef.current = setInterval(() => {
          setQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
      }, 60000); // 1 minute

      // Cleanup on unmount
      return () => {
          if (quoteRotationIntervalRef.current) {
              clearInterval(quoteRotationIntervalRef.current);
          }
      };
  }, [internalProgress, externalProgress, quotes.length]); // Re-runs on interaction, resetting the interval.

  // Effect for random boulder drops
  useEffect(() => {
    if (externalProgress !== undefined) return;

    const randomDropInterval = setInterval(() => {
      setPhysicsState(prev => {
        // Only trigger a random drop if Sisyphus is in a stable state and not at the very bottom.
        if (prev.phase === 'normal' && prev.boulderPosition > 20) {
            const randomDropAmount = Math.floor(Math.random() * 16) + 5; // Drop between 5% and 20%
            const newRollTarget = Math.max(0, prev.boulderPosition - randomDropAmount);

            return {
              ...prev,
              phase: 'chasing',
              boulderVelocity: PHYSICS.initialVelocity,
              rollTarget: newRollTarget,
            };
        }
        return prev;
      });
    }, 30000); // Approximately 2 times a minute

    return () => clearInterval(randomDropInterval);
  }, [externalProgress, PHYSICS.initialVelocity]);

  // Main physics animation loop
  useEffect(() => {
    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = Math.min((currentTime - lastTimeRef.current) / 1000, 0.033); // Cap at ~30fps
      lastTimeRef.current = currentTime;

      setPhysicsState(prev => {
        const {
          boulderPosition,
          sisyphusPosition,
          boulderVelocity,
          targetPosition,
          phase,
          animationPhase
        } = prev;

        const newState = {
          ...prev,
          animationPhase: (animationPhase + 1) % 1000
        };

        switch (phase) {
          case 'chasing': {
            const rollTarget = prev.rollTarget;
            if (boulderPosition > rollTarget) {
              const newVelocity = boulderVelocity + PHYSICS.gravity * deltaTime;
              const dampedVelocity = newVelocity * PHYSICS.friction;
              const newBoulderPos = Math.max(rollTarget, boulderPosition - dampedVelocity * deltaTime);
              let newSisyphusPos = sisyphusPosition;
              if (sisyphusPosition > newBoulderPos + 5) {
                newSisyphusPos = Math.max(newBoulderPos + 5, sisyphusPosition - PHYSICS.chaseSpeed * deltaTime);
              }
              return { ...newState, boulderPosition: newBoulderPos, sisyphusPosition: newSisyphusPos, boulderVelocity: dampedVelocity };
            } else {
              return { ...newState, phase: 'pushing', boulderPosition: rollTarget, sisyphusPosition: rollTarget, boulderVelocity: 0 };
            }
          }
          case 'pushing': {
            if (boulderPosition < targetPosition) {
              const moveAmount = PHYSICS.pushSpeed * deltaTime;
              const newPos = Math.min(targetPosition, boulderPosition + moveAmount);
              return { ...newState, boulderPosition: newPos, sisyphusPosition: newPos };
            } else {
              return { ...newState, phase: 'normal', boulderPosition: targetPosition, sisyphusPosition: targetPosition, boulderVelocity: 0 };
            }
          }
          default: { // 'normal'
            const distanceToTarget = Math.abs(boulderPosition - targetPosition);
            if (distanceToTarget > 0.1) {
              const direction = targetPosition > boulderPosition ? 1 : -1;
              if (direction < 0) {
                const newRollTarget = Math.max(0, boulderPosition - PHYSICS.rollAmount);
                return { ...newState, phase: 'chasing', boulderVelocity: PHYSICS.initialVelocity, rollTarget: newRollTarget };
              }
              const moveAmount = PHYSICS.moveSpeed * deltaTime;
              const newPos = boulderPosition + direction * moveAmount;
              return { ...newState, boulderPosition: newPos, sisyphusPosition: newPos };
            }
            return { ...newState, boulderPosition: targetPosition, sisyphusPosition: targetPosition };
          }
        }
      });
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const displayProgress = getDisplayProgress(physicsState.sisyphusPosition);
  const sisyphusPos = getPosition(physicsState.sisyphusPosition);
  const boulderPos = getPosition(physicsState.boulderPosition);
  const isChasing = physicsState.phase === 'chasing';
  const isPushing = physicsState.phase === 'pushing';
  const struggleOffset = isPushing ? Math.sin(physicsState.animationPhase / 8) * 0.8 : Math.sin(physicsState.animationPhase / 10) * 0.5;
  const sisyphusX = sisyphusPos.x + struggleOffset;
  const sisyphusY = sisyphusPos.y - Math.abs(Math.sin(physicsState.animationPhase / 10)) * 0.3;
  const boulderRotation = physicsState.boulderPosition * 7.2 + (isChasing ? physicsState.animationPhase * 5 : physicsState.animationPhase * 0.5);
  const legSpeed = isChasing ? 15 : isPushing ? 30 : 40;
  const isLeftLegForward = (physicsState.animationPhase % legSpeed) < legSpeed / 2;
  const currentQuote = quotes[quoteIndex];

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans" role="progressbar" aria-valuenow={displayProgress} aria-valuemin={0} aria-valuemax={100}>
      <div className="relative h-40 bg-amber-50 rounded-lg overflow-hidden shadow-2xl">
        <div className="absolute inset-0 border-4 border-amber-700 rounded-lg pointer-events-none">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="greekKey" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 0 0 L 0 5 L 2 5 L 2 2 L 5 2 L 5 0 Z" fill="none" stroke="#92400E" strokeWidth="0.5"/>
                <path d="M 5 0 L 8 0 L 8 3 L 10 3 L 10 0" fill="none" stroke="#92400E" strokeWidth="0.5"/>
                <path d="M 10 5 L 8 5 L 8 8 L 5 8 L 5 10 L 10 10" fill="none" stroke="#92400E" strokeWidth="0.5"/>
                <path d="M 0 10 L 0 7 L 2 7 L 2 10" fill="none" stroke="#92400E" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect x="2" y="2" width="96" height="8" fill="url(#greekKey)" opacity="0.3"/>
            <rect x="2" y="90" width="96" height="8" fill="url(#greekKey)" opacity="0.3"/>
          </svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-50">
          <svg className="absolute top-4 right-4 w-12 h-12">
            <circle cx="24" cy="24" r="10" fill="#FFA500" opacity="0.8"/>
            {[...Array(8)].map((_, i) => (
              <line key={i} x1="24" y1="24" x2={24 + 20 * Math.cos((i * Math.PI) / 4)} y2={24 + 20 * Math.sin((i * Math.PI) / 4)} stroke="#FFA500" strokeWidth="1" opacity="0.4" />
            ))}
          </svg>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {[...Array(3)].map((_, i) => {
              const orbitRadiusX = 20 + i * 7;
              const orbitRadiusY = 6 + i * 2;
              const speed = 0.5 + i * 0.15;
              const centerX = 50;
              const centerY = 22;
              const phaseOffset = i * 150;
              const angle = (physicsState.animationPhase * speed + phaseOffset) * (Math.PI / 180);
              const x = centerX + Math.cos(angle) * orbitRadiusX;
              const y = centerY + Math.sin(angle) * orbitRadiusY;
              const perspectiveFactor = (Math.sin(angle) + 1) / 2;
              const scale = 0.6 + perspectiveFactor * 0.4;
              const opacity = 0.7 + perspectiveFactor * 0.3;
              return (
                <g key={i} transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
                  <ellipse cx="0" cy="0" rx="2" ry="1.2" fill="#2F4F4F" />
                  <path d="M -2 0 Q -3.5 -0.8 -4 0 Q -3.5 0.8 -2 0" fill="#2F4F4F" opacity="0.8">
                    <animate attributeName="d" values="M -2 0 Q -3.5 -0.8 -4 0 Q -3.5 0.8 -2 0;M -2 0 Q -3.5 -1.5 -4 0 Q -3.5 0.2 -2 0;M -2 0 Q -3.5 -0.8 -4 0 Q -3.5 0.8 -2 0" dur="1s" repeatCount="indefinite" />
                  </path>
                  <path d="M 2 0 Q 3.5 -0.8 4 0 Q 3.5 0.8 2 0" fill="#2F4F4F" opacity="0.8">
                    <animate attributeName="d" values="M 2 0 Q 3.5 -0.8 4 0 Q 3.5 0.8 2 0;M 2 0 Q 3.5 -1.5 4 0 Q 3.5 0.2 2 0;M 2 0 Q 3.5 -0.8 4 0 Q 3.5 0.8 2 0" dur="1s" repeatCount="indefinite" />
                  </path>
                  <circle cx="-1.5" cy="0" r="0.4" fill="#8B4513" />
                </g>
              );
            })}
          </svg>
        </div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="marble" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#D4A373"/>
              <path d="M 0 5 Q 10 3 20 5" stroke="#C19660" strokeWidth="0.5" fill="none" opacity="0.5"/>
              <path d="M 0 15 Q 10 13 20 15" stroke="#C19660" strokeWidth="0.5" fill="none" opacity="0.5"/>
              <circle cx="5" cy="10" r="1" fill="#B8956A" opacity="0.3"/>
              <circle cx="15" cy="7" r="0.5" fill="#B8956A" opacity="0.3"/>
            </pattern>
          </defs>
          <path d="M 0 100 L 85 50 L 100 48 L 100 100 Z" fill="url(#marble)" stroke="#8B6914" strokeWidth="1" />
          <path d="M 10 95 Q 30 85 50 70 T 85 53" stroke="#F5DEB3" strokeWidth="3" fill="none" opacity="0.6" />
        </svg>
        <svg className="absolute left-2 bottom-0 w-8 h-16" viewBox="0 0 20 40">
          <rect x="4" y="5" width="12" height="30" fill="#DDD" stroke="#AAA" strokeWidth="0.5"/>
          <rect x="2" y="0" width="16" height="5" fill="#DDD" stroke="#AAA" strokeWidth="0.5"/>
          <rect x="2" y="35" width="16" height="5" fill="#DDD" stroke="#AAA" strokeWidth="0.5"/>
          {[...Array(4)].map((_, i) => (
            <line key={i} x1={6 + i * 3} y1="5" x2={6 + i * 3} y2="35" stroke="#AAA" strokeWidth="0.3"/>
          ))}
        </svg>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <g transform={`translate(${boulderPos.x}, ${boulderPos.y - 7})`}>
            <g transform={`rotate(${boulderRotation} 0 0)`}>
              <circle cx="0" cy="0" r="7" fill="#8B7D6B" stroke="#5D4E37" strokeWidth="0.8" />
              <path d="M -3 -3 L -1 0 L -3 3" stroke="#5D4E37" strokeWidth="0.3" fill="none"/>
              <path d="M 2 -4 L 3 -1 L 1 2" stroke="#5D4E37" strokeWidth="0.3" fill="none"/>
              <circle cx="-2" cy="-2" r="1.5" fill="#6B5D54" opacity="0.4" />
              <circle cx="2" cy="1" r="1" fill="#6B5D54" opacity="0.4" />
            </g>
          </g>
        </svg>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <g transform={`translate(${sisyphusX}, ${sisyphusY})`}>
            <g transform={`translate(-10, -3) scale(1) rotate(${isChasing ? 5 : isPushing ? -10 : -struggleOffset * 2} 0 0)`}>
              <ellipse cx="0" cy="8" rx="4" ry="1" fill="#000" opacity="0.2" />
              <g transform={`rotate(${isLeftLegForward ? -15 : 15} -1 3)`}>
                <path d="M -1 3 L -3 6 L -3 8" stroke="#D4A373" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <circle cx="-3" cy="8" r="1" fill="#8B4513"/>
              </g>
              <ellipse cx="0" cy="0" rx={3 + Math.sin(physicsState.animationPhase / (isPushing ? 8 : 20)) * 0.2} ry="4" fill="#D4A373" />
              <path d="M -3 -2 L 3 -2 L 2.5 4 L -2.5 4 Z" fill="#FFF" opacity="0.9" />
              <path d="M -3 -2 L -2.5 4" stroke="#DDD" strokeWidth="0.3"/><path d="M 3 -2 L 2.5 4" stroke="#DDD" strokeWidth="0.3"/>
              <path d="M -2 0 L 2 0" stroke="#E6E6E6" strokeWidth="0.2"/><path d="M -2 2 L 2 2" stroke="#E6E6E6" strokeWidth="0.2"/>
              {isChasing ? (
                <g>
                  <path d={`M 2 -1 Q 0 ${isLeftLegForward ? -2 : 0} -2 ${isLeftLegForward ? -1 : 1}`} stroke="#D4A373" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <path d={`M 2 1 Q 4 ${isLeftLegForward ? 0 : 2} 5 ${isLeftLegForward ? 1 : -1}`} stroke="#D4A373" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                </g>
              ) : (
                <g transform={`rotate(${isPushing ? -5 : Math.sin(physicsState.animationPhase / 15) * 3} 2 0)`}>
                  <path d="M 2 -1 Q 5 -1.5 8 -2" stroke="#D4A373" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <path d="M 2 1 Q 5 0.5 8 0" stroke="#D4A373" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                  <circle cx="4" cy="-1" r="0.5" fill="#C19660" opacity="0.3"/><circle cx="4" cy="0.5" r="0.5" fill="#C19660" opacity="0.3"/>
                </g>
              )}
              <g transform={`rotate(${!isLeftLegForward ? -15 : 15} 1 3)`}>
                <path d="M 1 3 L 2 6 L 2 8" stroke="#D4A373" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <circle cx="2" cy="8" r="1" fill="#8B4513"/>
              </g>
              <g transform={`translate(0, ${Math.sin(physicsState.animationPhase / 10) * 0.2})`}>
                <circle cx="0" cy="-5" r="2.5" fill="#D4A373" />
                <path d="M -2.5 -6.5 Q 0 -7.5 2.5 -6.5" fill="#2F4F4F" />
                <path d="M -2 -5 Q -2.5 -3 -2 -3" fill="#2F4F4F" /><path d="M 2 -5 Q 2.5 -3 2 -3" fill="#2F4F4F" />
                <path d="M -1.5 -3.5 Q 0 -2.5 1.5 -3.5" fill="#2F4F4F" opacity="0.7"/>
                <path d="M -2.5 -6 Q -2 -7 0 -7.2 Q 2 -7 2.5 -6" stroke="#228B22" strokeWidth="0.5" fill="none"/>
                <ellipse cx="-2" cy="-6.5" rx="0.3" ry="0.5" fill="#228B22" transform="rotate(-30 -2 -6.5)"/>
                <ellipse cx="2" cy="-6.5" rx="0.3" ry="0.5" fill="#228B22" transform="rotate(30 2 -6.5)"/>
                <circle cx="-0.7" cy="-5" r="0.2" fill="#000"/><circle cx="0.7" cy="-5" r="0.2" fill="#000"/>
                <path d={`M -0.5 -4.3 Q 0 ${-4 + (isChasing ? -0.3 : isPushing ? 0.2 : Math.sin(physicsState.animationPhase / 8) * 0.1)} 0.5 -4.3`} stroke="#000" strokeWidth="0.1" fill="none" />
              </g>
              {(isPushing || physicsState.phase === 'normal') && (
                <>
                  <path d="M 3 -6 L 4 -7" stroke="#FFD700" strokeWidth="0.3" opacity={0.6 + Math.sin(physicsState.animationPhase / 5) * 0.3}/>
                  <path d="M 3.5 -4 L 4.5 -4" stroke="#FFD700" strokeWidth="0.3" opacity={0.6 + Math.sin(physicsState.animationPhase / 7) * 0.3}/>
                  {isPushing && ( <path d="M 3 -2 L 4 -1" stroke="#FFD700" strokeWidth="0.3" opacity={0.6 + Math.sin(physicsState.animationPhase / 6) * 0.3}/> )}
                </>
              )}
            </g>
          </g>
          {(displayProgress > 30 || isPushing) && !isChasing && (
            <circle cx={sisyphusX - 10} cy={sisyphusY - 8} r="0.8" fill="#4682B4" opacity="0.6">
              <animate attributeName="cy" from={sisyphusY - 8} to={sisyphusY + 10} dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}
          {(displayProgress > 60 || isPushing) && !isChasing && (
            <>
              <circle cx={sisyphusX - 8} cy={sisyphusY - 10} r="0.6" fill="#4682B4" opacity="0.6">
                <animate attributeName="cy" from={sisyphusY - 10} to={sisyphusY + 8} dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={sisyphusX - 12} cy={sisyphusY - 6} r="0.7" fill="#4682B4" opacity="0.6">
                <animate attributeName="cy" from={sisyphusY - 6} to={sisyphusY + 12} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
            </>
          )}
          {[...Array(3)].map((_, i) => (
            <circle key={i} cx={sisyphusX - 5 + i * 2} cy={sisyphusY + 7} r="0.3" fill="#D4A373" opacity={Math.sin(physicsState.animationPhase / (isChasing ? 3 : 10) + i) * 0.3 + 0.2} />
          ))}
          {isChasing && ( <text x={sisyphusX - 15} y={sisyphusY - 15} fontSize="4" fill="#8B4513" fontWeight="bold">!!!</text> )}
        </svg>
        {showPercentage && (
          <div className="absolute bottom-3 right-3 text-sm font-bold text-amber-800 bg-amber-100 px-2 py-1 rounded border border-amber-600">
            {displayProgress.toFixed(1)}%
          </div>
        )}
        {currentQuote && displayProgress < 95 && (
          <div className="absolute top-2 left-4 right-4 text-center">
            <div className="text-xs text-amber-900 italic bg-amber-50 bg-opacity-80 p-2 rounded-md shadow">
              "{currentQuote}"
            </div>
          </div>
        )}
        {displayProgress >= 95 && (
          <div className="absolute top-4 left-4 right-4 text-center">
            <div className="text-sm text-amber-900 font-serif italic">
               "One must imagine Sisyphus happy."
            </div>
          </div>
        )}
      </div>
      {externalProgress === undefined && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Progress Control: {internalProgress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={internalProgress}
            onChange={(e) => setInternalProgress(Number(e.target.value))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #D97706 0%, #D97706 ${internalProgress}%, #FED7AA ${internalProgress}%, #FED7AA 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SisyphusProgressBar;
