import React from 'react';

/**
 * DashboardLoader — FightFlex branded full-page loader for the admin dashboard.
 * Shows animated logo + brand wordmark + pulsing barbell icon.
 * Use while data is fetching or on initial dashboard load.
 *
 * Usage:  <DashboardLoader />
 *         <DashboardLoader message="Loading orders..." />
 */
const DashboardLoader = ({ message = 'Loading dashboard...' }) => {
  return (
    <>
      <style>{`
        @keyframes dl-pulse {
          0%, 100% { transform: scale(1);    opacity: 1;   }
          50%       { transform: scale(0.92); opacity: 0.6; }
        }
        @keyframes dl-bar {
          0%   { width: 0%;   }
          60%  { width: 85%;  }
          100% { width: 100%; }
        }
        @keyframes dl-fade-up {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0);    }
        }
        @keyframes dl-spin-slow {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(360deg); }
        }
        @keyframes dl-dot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
      `}</style>

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}>

        {/* ── Animated barbell ring ── */}
        <div style={{ position: 'relative', width: 80, height: 80, marginBottom: 28 }}>

          {/* Outer spinning ring */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: '#111',
            borderRightColor: '#111',
            animation: 'dl-spin-slow 1s linear infinite',
          }} />

          {/* Inner subtle ring */}
          <div style={{
            position: 'absolute', inset: 8,
            borderRadius: '50%',
            border: '1.5px solid #e5e7eb',
          }} />

          {/* Logo inside circle */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'dl-pulse 1.8s ease-in-out infinite',
          }}>
            <img
              src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png"
              alt="FightFlex"
              style={{ width: 36, height: 36, objectFit: 'contain', filter: 'brightness(0)' }}
            />
          </div>
        </div>

        {/* ── Brand wordmark ── */}
        <div style={{ animation: 'dl-fade-up 0.5s ease 0.1s both', textAlign: 'center' }}>
          <span style={{
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            letterSpacing: '0.35em',
            color: '#111',
            display: 'block',
          }}>
            FIGHTFLEX
          </span>
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.62rem',
            letterSpacing: '0.18em',
            color: '#9ca3af',
            textTransform: 'uppercase',
            fontWeight: 600,
            display: 'block',
            marginTop: 4,
          }}>
            Admin Portal
          </span>
        </div>

        {/* ── Progress bar ── */}
        <div style={{
          marginTop: 28,
          width: 'clamp(140px, 20vw, 200px)',
          height: 2,
          background: '#f3f4f6',
          borderRadius: 999,
          overflow: 'hidden',
          animation: 'dl-fade-up 0.4s ease 0.25s both',
        }}>
          <div style={{
            height: '100%',
            background: '#111',
            borderRadius: 999,
            animation: 'dl-bar 1.6s cubic-bezier(0.4,0,0.2,1) 0.3s both',
          }} />
        </div>

        {/* ── Loading dots + message ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 20,
          animation: 'dl-fade-up 0.4s ease 0.4s both',
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'inline-block',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#d1d5db',
              animation: `dl-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
            }} />
          ))}
          <span style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.72rem',
            color: '#9ca3af',
            fontWeight: 500,
            marginLeft: 4,
          }}>
            {message}
          </span>
        </div>

      </div>
    </>
  );
};

export default DashboardLoader;
