import React, { useState, useEffect } from 'react';

/**
 * SplashLoader — 3-section animation
 *  Strip 1 (left half)  slides in from LEFT
 *  Strip 2 (right half) slides in from RIGHT
 *  Strip 3 (top strip)  slides down from TOP
 *  Logo + text appear in center
 *  All 3 sections slide back out on exit
 */
const SplashLoader = ({ onFinish }) => {
  const [phase, setPhase] = useState(0);
  // 0 = initial (all hidden)
  // 1 = strip1 enters from left
  // 2 = strip2 enters from right
  // 3 = strip3 enters from top
  // 4 = logo/text fade in + hold
  // 5 = exit begins
  // 6 = done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 50);
    const t2 = setTimeout(() => setPhase(2), 300);
    const t3 = setTimeout(() => setPhase(3), 550);
    const t4 = setTimeout(() => setPhase(4), 800);
    const t5 = setTimeout(() => setPhase(5), 2400);
    const t6 = setTimeout(() => setPhase(6), 3300);
    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase === 6) onFinish?.();
  }, [phase, onFinish]);

  if (phase === 6) return null;

  const entering = (p) => phase >= p && phase < 5;
  const exiting  = phase === 5;

  const ease = 'cubic-bezier(0.76, 0, 0.24, 1)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        overflow: 'hidden',
        background: '#000',         // solid black fallback so no gap ever shows
        pointerEvents: 'all',       // block ALL interaction under the splash
      }}
    >
      {/* ── Strip 1: Left half, slides in from LEFT ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: '#111',
          transform: entering(1)
            ? exiting ? 'translateX(-102%)' : 'translateX(0)'
            : 'translateX(-102%)',
          transition: exiting
            ? `transform 0.65s ${ease}`
            : phase === 1
            ? `transform 0.5s ${ease}`
            : 'none',
        }}
      />

      {/* ── Strip 2: Right half, slides in from RIGHT ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: '#0d0d0d',
          transform: entering(2)
            ? exiting ? 'translateX(102%)' : 'translateX(0)'
            : 'translateX(102%)',
          transition: exiting
            ? `transform 0.65s ${ease} 0.06s`
            : phase === 2
            ? `transform 0.5s ${ease}`
            : 'none',
        }}
      />

      {/* ── Strip 3: Top bar, slides down from TOP ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '64px',
          background: '#181818',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          transform: entering(3)
            ? exiting ? 'translateY(-102%)' : 'translateY(0)'
            : 'translateY(-102%)',
          transition: exiting
            ? `transform 0.55s ${ease} 0.12s`
            : phase === 3
            ? `transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)`
            : 'none',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
        }}
      >
        {/* Top bar left dots */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: `rgba(255,255,255,${0.1 * i})`,
                display: 'block',
              }}
            />
          ))}
        </div>
        {/* Top bar label */}
        <span style={{
          fontFamily: 'monospace', fontSize: '0.6rem',
          letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)',
          textTransform: 'uppercase', fontWeight: 700,
        }}>
          Loading...
        </span>
      </div>

      {/* ── Center Logo ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        {/* Logo image */}
        <img
          src="https://i.postimg.cc/5yxd84ZJ/Fight-Flex2-removebg-preview.png"
          alt="FightFlex"
          style={{
            width: '100px',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: phase >= 4 && !exiting ? 1 : 0,
            transform: phase >= 4 && !exiting ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(12px)',
            transition: 'opacity 0.5s ease, transform 0.55s cubic-bezier(0.34,1.4,0.64,1)',
          }}
        />

        {/* Brand name */}
        <span
          style={{
            fontFamily: 'monospace',
            fontWeight: 900,
            fontSize: 'clamp(1.4rem, 5vw, 2rem)',
            letterSpacing: '0.3em',
            color: '#fff',
            marginTop: '10px',
            opacity: phase >= 4 && !exiting ? 1 : 0,
            transform: phase >= 4 && !exiting ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.45s ease 0.1s, transform 0.45s ease 0.1s',
          }}
        >
          FIGHTFLEX
        </span>

        {/* Tagline */}
        <span
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 500,
            fontSize: '0.6rem',
            letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.35)',
            textTransform: 'uppercase',
            marginTop: '6px',
            opacity: phase >= 4 && !exiting ? 1 : 0,
            transform: phase >= 4 && !exiting ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.45s ease 0.22s, transform 0.45s ease 0.22s',
          }}
        >
          Train Hard. Fight Smart.
        </span>

        {/* Progress bar */}
        <div
          style={{
            marginTop: '32px',
            width: 'min(160px, 40vw)',
            height: '2px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '999px',
            overflow: 'hidden',
            opacity: phase >= 4 && !exiting ? 1 : 0,
            transition: 'opacity 0.3s ease 0.3s',
          }}
        >
          <div
            style={{
              height: '100%',
              background: '#fff',
              borderRadius: '999px',
              width: phase >= 4 && !exiting ? '100%' : '0%',
              transition: phase >= 4 && !exiting
                ? 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.35s'
                : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashLoader;
