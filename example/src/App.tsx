import React, { useState, useEffect } from 'react';
import { SisyphusProgressBar } from 'sisyphus-progressbar';

function App() {
  const [controlledProgress, setControlledProgress] = useState<number>(30);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Simulate loading process
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setControlledProgress(prev => {
        if (prev >= 100) {
          setIsSimulating(false);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const startSimulation = () => {
    setControlledProgress(0);
    setIsSimulating(true);
  };

  const resetProgress = () => {
    setIsSimulating(false);
    setControlledProgress(30);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Sisyphus Progress Bar
          </h1>
          <p className="text-xl text-amber-800 max-w-2xl mx-auto">
            A animated progress bar inspired by the myth of Sisyphus. 
            Watch as our eternal hero pushes his boulder up the mountain with physics-based animations.
          </p>
        </header>

        <div className="space-y-12 bg-white/20 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
          {/* Controlled Example */}
          <section>
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">Controlled Progress</h2>
            <div className="bg-white/40 rounded-xl p-6">
              <SisyphusProgressBar 
                progress={controlledProgress} 
                showPercentage={true}
              />
              
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={startSimulation}
                    disabled={isSimulating}
                    className="px-6 py-2 bg-amber-700 hover:bg-amber-800 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {isSimulating ? 'Simulating...' : 'Start Loading Simulation'}
                  </button>
                  
                  <button
                    onClick={resetProgress}
                    className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-amber-900 font-medium">
                    Manual Control: {controlledProgress.toFixed(1)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={controlledProgress}
                    onChange={(e) => setControlledProgress(Number(e.target.value))}
                    disabled={isSimulating}
                    className="w-full h-3 bg-white/30 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Uncontrolled Example */}
          <section>
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">Uncontrolled Progress (Interactive)</h2>
            <div className="bg-white/40 rounded-xl p-6">
              <SisyphusProgressBar showPercentage={true} />
              <p className="text-amber-800 text-sm mt-4 text-center">
                ↑ This version has its own internal controls. Watch for random boulder drops and rotating quotes!
              </p>
            </div>
          </section>

          {/* Without Percentage */}
          <section>
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">Without Percentage Display</h2>
            <div className="bg-white/40 rounded-xl p-6">
              <SisyphusProgressBar 
                progress={75} 
                showPercentage={false}
              />
              <p className="text-amber-800 text-sm mt-4 text-center">
                Same component with showPercentage={`{false}`}
              </p>
            </div>
          </section>

          {/* Philosophy Section */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">The Philosophy</h2>
            <blockquote className="text-lg text-amber-900 italic max-w-3xl mx-auto mb-4">
              "The struggle itself toward the heights is enough to fill a man's heart. 
              One must imagine Sisyphus happy."
            </blockquote>
            <p className="text-amber-700">— Albert Camus, The Myth of Sisyphus</p>
          </section>

          {/* Usage Instructions */}
          <section>
            <h2 className="text-2xl font-semibold text-amber-900 mb-6">Installation & Usage</h2>
            <div className="bg-gray-900 rounded-xl p-6 text-left">
              <pre className="text-green-400 text-sm overflow-x-auto">
{`npm install sisyphus-progressbar

import { SisyphusProgressBar } from 'sisyphus-progressbar';

// Controlled
<SisyphusProgressBar progress={50} showPercentage={true} />

// Uncontrolled (interactive)
<SisyphusProgressBar showPercentage={true} />`}
              </pre>
            </div>
          </section>
        </div>

        <footer className="text-center mt-12 text-amber-700">
          <p>Created with ❤️ and existential philosophy</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
