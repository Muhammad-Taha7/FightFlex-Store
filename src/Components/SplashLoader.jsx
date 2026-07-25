import React, { useState, useEffect } from 'react';

/**
 * FightFlex SplashLoader
 * - Exact 2.0s duration (1.5s hold + 0.5s split exit transition)
 * - Fully responsive for mobile and desktop screens
 */

const SplashLoader = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // 1.5 second hold -> trigger exit transition
    const t1 = setTimeout(() => setExiting(true), 1500);

    // Complete at exactly 2.0 seconds (2000ms)
    const t2 = setTimeout(() => {
      setDone(true);
      onFinish?.();
    }, 2000);

    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
    };
  }, [onFinish]);

  if (done) return null;

  const easePower = 'cubic-bezier(0.76, 0, 0.24, 1)';

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes ff-logo {
          0%   { opacity: 0; transform: scale(0.85) translateY(12px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ff-text {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ff-bar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes ff-slide-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-101%); }
        }
        @keyframes ff-slide-down {
          0%   { transform: translateY(0); }
          100% { transform: translateY(101%); }
        }
        @keyframes ff-fade-out {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.95); }
        }
      `}</style>

      {/* Outer wrapper - dynamic viewport height fix for mobile */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: '100dvh', // Mobile browser height fix
          width: '100vw',
          zIndex: 99999,
          overflow: 'hidden',
          pointerEvents: 'all',
          background: '#000',
          boxSizing: 'border-box',
        }}
      >
        {/* ── TOP SECTION ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, 
            left: 0,
            width: '100%',
            height: '50%',
            background: '#000',
            animation: exiting
              ? `ff-slide-up 0.5s ${easePower} forwards`
              : 'none',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            padding: 'calc(env(safe-area-inset-top) + 20px) 24px 0 24px',
            boxSizing: 'border-box',
          }}
        >
          <span style={{
            fontFamily: 'monospace, sans-serif',
            fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'ff-text 0.4s ease 0.1s both',
          }}>
            est. 2024
          </span>
        </div>

        {/* ── BOTTOM SECTION ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, 
            left: 0,
            width: '100%',
            height: '50%',
            background: '#000',
            animation: exiting
              ? `ff-slide-down 0.5s ${easePower} forwards`
              : 'none',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            padding: '0 0 calc(env(safe-area-inset-bottom) + 20px) 24px',
            boxSizing: 'border-box',
          }}
        >
          <span style={{
            fontFamily: 'monospace, sans-serif',
            fontSize: 'clamp(0.6rem, 2vw, 0.75rem)',
            letterSpacing: '0.25em',
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'ff-text 0.4s ease 0.15s both',
          }}>
            Premium Sportswear
          </span>
        </div>

        {/* ── CENTER CONTENT (Logo, Text & Progress Bar) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            animation: exiting
              ? `ff-fade-out 0.4s ease forwards`
              : 'none',
            padding: '0 16px',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            maxWidth: '480px',
          }}>

            {/* Logo Image */}
            <img
              src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png"
              alt="FightFlex"
              style={{
                width: 'clamp(75px, 20vw, 130px)',
                height: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                animation: 'ff-logo 0.5s cubic-bezier(0.34,1.4,0.64,1) both',
              }}
            />

            {/* Brand Title */}
            <span style={{
              fontFamily: 'monospace, sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
              letterSpacing: 'clamp(0.15em, 1vw, 0.35em)',
              color: '#fff',
              marginTop: '12px',
              animation: 'ff-text 0.4s ease 0.15s both',
              wordBreak: 'break-word',
            }}>
              FIGHTFLEX
            </span>

            {/* Tagline */}
            <span style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(0.65rem, 2.5vw, 0.85rem)',
              letterSpacing: 'clamp(0.12em, 0.8vw, 0.25em)',
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              marginTop: '6px',
              animation: 'ff-text 0.4s ease 0.25s both',
            }}>
              Train Hard. Fight Smart.
            </span>

            {/* Progress Bar (Fills in ~1.2s to match 1.5s exit) */}
            <div style={{
              marginTop: '28px',
              width: 'clamp(140px, 40vw, 220px)',
              height: '2px',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '999px',
              overflow: 'hidden',
              animation: 'ff-text 0.3s ease 0.3s both',
            }}>
              <div style={{
                height: '100%',
                background: '#fff',
                borderRadius: '999px',
                animation: 'ff-bar 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both',
              }} />
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default SplashLoader;