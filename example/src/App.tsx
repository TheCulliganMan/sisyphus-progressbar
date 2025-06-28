import React, { useState, useEffect } from 'react';
import SisyphusProgressBar from 'sisyphus-progressbar';

function App() {
  const [controlledProgress, setControlledProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isRunning) {
      timer = setInterval(() => {
        setControlledProgress(prev => {
          const next = prev + Math.random() * 3; // Variable speed
          if (next >= 100) {
            setIsRunning(false);
            return 100;
          }
          return next;
        });
      }, 200);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning]);

  const handleStart = () => {
    setControlledProgress(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setControlledProgress(0);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FDF6E3', 
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#92400E', 
          marginBottom: '2rem',
          fontSize: '2.5rem'
        }}>
          Sisyphus Progress Bar Demo
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gap: '2rem', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' 
        }}>
          {/* Uncontrolled Example */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#92400E', marginBottom: '1rem' }}>
              Uncontrolled (Interactive)
            </h2>
            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Use the slider to control progress manually. Watch Sisyphus push the boulder!
            </p>
            <SisyphusProgressBar />
          </div>

          {/* Controlled Example */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#92400E', marginBottom: '1rem' }}>
              Controlled Progress
            </h2>
            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Simulates automatic progress like file uploads or downloads.
            </p>
            
            <div style={{ marginBottom: '1rem' }}>
              <button
                onClick={handleStart}
                disabled={isRunning}
                style={{
                  backgroundColor: isRunning ? '#D1D5DB' : '#D97706',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  marginRight: '0.5rem',
                  cursor: isRunning ? 'not-allowed' : 'pointer'
                }}
              >
                {isRunning ? 'Running...' : 'Start Progress'}
              </button>
              
              <button
                onClick={handleReset}
                style={{
                  backgroundColor: '#6B7280',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer'
                }}
              >
                Reset
              </button>
            </div>
            
            <SisyphusProgressBar 
              progress={controlledProgress} 
              showPercentage={true}
            />
          </div>

          {/* No Percentage Example */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#92400E', marginBottom: '1rem' }}>
              Without Percentage
            </h2>
            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Clean view without percentage display.
            </p>
            <SisyphusProgressBar 
              progress={65} 
              showPercentage={false}
            />
          </div>

          {/* Near Completion Example */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#92400E', marginBottom: '1rem' }}>
              Near Completion
            </h2>
            <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Shows the completion message when progress reaches 95%+.
            </p>
            <SisyphusProgressBar 
              progress={96} 
              showPercentage={true}
            />
          </div>
        </div>

        <div style={{ 
          marginTop: '3rem', 
          textAlign: 'center', 
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <p>
            "The struggle itself toward the heights is enough to fill a man's heart. 
            One must imagine Sisyphus happy."
          </p>
          <p style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
            — Albert Camus, The Myth of Sisyphus
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
