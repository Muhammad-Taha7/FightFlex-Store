import React, { useState, useEffect } from 'react';

/**
 * FightFlex SplashLoader
 * - Cleaned layout (no visible section divider lines)
 * - Optimized fast duration (~1s display + 0.5s exit transition)
 */

const SplashLoader = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Hold splash for 1.0 second then trigger smooth exit transition
    const t1 = setTimeout(() => setExiting(true), 1000);
    const t2 = setTimeout(() => {
      setDone(true);
      onFinish?.();
    }, 1500); // Total 1.5s (1000ms hold + 500ms exit)

    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
    };
  }, [onFinish]);

  if (done) return null;

  const easePower = 'cubic-bezier(0.76, 0, 0.24, 1)';

  return (
    <>
      {/* Keyframe definitions */}
      <style>{`
        @keyframes ff-logo {
          0%   { opacity: 0; transform: scale(0.8) translateY(12px); }
          100% { opacity: 1; transform: scale(1)   translateY(0);    }
        }
        @keyframes ff-text {
          0%   { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0);   }
        }
        @keyframes ff-bar {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes ff-slide-up {
          0%   { transform: translateY(0);    }
          100% { transform: translateY(-101%); }
        }
        @keyframes ff-slide-down {
          0%   { transform: translateY(0);   }
          100% { transform: translateY(101%); }
        }
        @keyframes ff-fade-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Outer container */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          overflow: 'hidden',
          pointerEvents: 'all',
          background: '#000',
        }}
      >
        {/* ── TOP SECTION ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, 
            left: 0,
            width: '100%',
            height: '33.334%',
            background: '#000',
            animation: exiting
              ? `ff-slide-up 0.5s ${easePower} forwards`
              : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 36px',
          }}
        >
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'ff-text 0.3s ease 0.1s both',
          }}>
            est. 2024
          </span>
        </div>

        {/* ── MIDDLE SECTION — Logo & Text ── */}
        <div
          style={{
            position: 'absolute',
            top: '33.334%',
            left: 0,
            width: '100%',
            height: '33.334%',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: exiting
              ? `ff-fade-out 0.4s ease forwards`
              : 'none',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}>

            {/* Logo Image */}
            <img
              src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png"
              alt="FightFlex"
              style={{
                width: 'clamp(90px, 15vw, 140px)',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                animation: 'ff-logo 0.4s cubic-bezier(0.34,1.4,0.64,1) both',
              }}
            />

            {/* Brand Title */}
            <span style={{
              fontFamily: 'monospace',
              fontWeight: 900,
              fontSize: 'clamp(1.75rem, 5.5vw, 2.75rem)',
              letterSpacing: '0.4em',
              color: '#fff',
              marginTop: '12px',
              animation: 'ff-text 0.3s ease 0.15s both',
            }}>
              FIGHTFLEX
            </span>

            {/* Tagline */}
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(0.7rem, 2vw, 0.95rem)',
              letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              marginTop: '8px',
              animation: 'ff-text 0.3s ease 0.25s both',
            }}>
              Train Hard. Fight Smart.
            </span>

            {/* Progress Bar (Fast 0.8s fill) */}
            <div style={{
              marginTop: '32px',
              width: 'clamp(160px, 25vw, 240px)',
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '999px',
              overflow: 'hidden',
              animation: 'ff-text 0.2s ease 0.3s both',
            }}>
              <div style={{
                height: '100%',
                background: '#fff',
                borderRadius: '999px',
                animation: 'ff-bar 0.75s linear 0.25s both',
              }} />
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, 
            left: 0,
            width: '100%',
            height: '33.334%',
            background: '#000',
            animation: exiting
              ? `ff-slide-down 0.5s ${easePower} forwards`
              : 'none',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 0 28px 36px',
          }}
        >
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'ff-text 0.3s ease 0.15s both',
          }}>
            Premium Sportswear
          </span>
        </div>

      </div>
    </>
  );
};

export default SplashLoader;