import React, { useState, useEffect } from 'react';

/**
 * FightFlex SplashLoader
 * - Enlarged Logo, Brand, and Tagline fonts
 * - Increased display duration for better visual impact
 * - Smooth split transitions on exit
 */

const SplashLoader = ({ onFinish }) => {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Increased duration: Hold splash for ~4 seconds before exit sequence starts
    const t1 = setTimeout(() => setExiting(true), 4000);
    const t2 = setTimeout(() => {
      setDone(true);
      onFinish?.();
    }, 4800); // 4000ms hold + 800ms slide-out animation

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
          0%   { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1)   translateY(0);    }
        }
        @keyframes ff-text {
          0%   { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0);    }
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
        }}
      >
        {/* ── TOP SECTION (slides UP on exit) ── */}
        <div
          style={{
            position: 'absolute',
            top: 0, 
            left: 0,
            width: '100%',
            height: '33.334%',
            background: 'linear-gradient(180deg, #0d0d0d 0%, #050505 100%)',
            animation: exiting
              ? `ff-slide-up 0.75s ${easePower} forwards`
              : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 36px',
          }}
        >
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.65rem', // Bada kar diya
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'ff-text 0.4s ease 0.5s both',
          }}>
            est. 2024
          </span>
        </div>

        {/* ── DIVIDER LINE (top → mid) ── */}
        <div style={{
          position: 'absolute',
          top: '33.334%',
          left: 0,
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 1,
          animation: exiting ? `ff-fade-out 0.3s ease forwards` : 'none',
        }} />

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
              ? `ff-fade-out 0.55s ease 0.1s forwards`
              : 'none',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}>

            {/* Logo Image - Pehle se bada size */}
            <img
              src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png"
              alt="FightFlex"
              style={{
                width: 'clamp(90px, 15vw, 140px)', // Bada sizing (Purana: 60px to 90px)
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                animation: 'ff-logo 0.7s cubic-bezier(0.34,1.4,0.64,1) 0.2s both',
              }}
            />

            {/* Brand Title - Pehle se bada font */}
            <span style={{
              fontFamily: 'monospace',
              fontWeight: 900,
              fontSize: 'clamp(1.75rem, 5.5vw, 2.75rem)', // Bada font (Purana: 1.25rem to 1.75rem)
              letterSpacing: '0.4em',
              color: '#fff',
              marginTop: '12px',
              animation: 'ff-text 0.5s ease 0.5s both',
            }}>
              FIGHTFLEX
            </span>

            {/* Tagline - Bada font size */}
            <span style={{
              fontFamily: 'system-ui, sans-serif',
              fontWeight: 600,
              fontSize: 'clamp(0.7rem, 2vw, 0.95rem)', // Bada font (Purana: 0.58rem)
              letterSpacing: '0.32em',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              marginTop: '8px',
              animation: 'ff-text 0.5s ease 0.7s both',
            }}>
              Train Hard. Fight Smart.
            </span>

            {/* Progress bar - Thodi wider or adjust ki gayi duration */}
            <div style={{
              marginTop: '32px',
              width: 'clamp(160px, 25vw, 240px)', // Bada sizing
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '999px',
              overflow: 'hidden',
              animation: 'ff-text 0.3s ease 0.9s both',
            }}>
              <div style={{
                height: '100%',
                background: '#fff',
                borderRadius: '999px',
                animation: 'ff-bar 2.8s cubic-bezier(0.4,0,0.2,1) 0.9s both', // Extended progress duration
              }} />
            </div>
          </div>
        </div>

        {/* ── DIVIDER LINE (mid → bot) ── */}
        <div style={{
          position: 'absolute',
          top: 'calc(33.334% + 33.334%)',
          left: 0,
          width: '100%',
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          zIndex: 1,
          animation: exiting ? `ff-fade-out 0.3s ease forwards` : 'none',
        }} />

        {/* ── BOTTOM SECTION (slides DOWN on exit) ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, 
            left: 0,
            width: '100%',
            height: '33.334%',
            background: 'linear-gradient(0deg, #0d0d0d 0%, #050505 100%)',
            animation: exiting
              ? `ff-slide-down 0.75s ${easePower} forwards`
              : 'none',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 0 28px 36px',
          }}
        >
          <span style={{
            fontFamily: 'monospace',
            fontSize: '0.65rem', // Bada font
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.2)',
            textTransform: 'uppercase',
            fontWeight: 700,
            animation: 'ff-text 0.4s ease 0.55s both',
          }}>
            Premium Sportswear
          </span>
        </div>

      </div>
    </>
  );
};

export default SplashLoader;