import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Dumbbell } from 'lucide-react';

/* ── Inline social SVGs (lucide-react may not bundle these) ── */
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);
const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
    <polygon fill="#000" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
  </svg>
);
const IconTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { label: 'Men', to: '/men' },
    { label: 'Women', to: '/women' },
    { label: 'Kids', to: '/kids' },
    { label: 'Accessories', to: '/accessories' },
    { label: 'Nutrition', to: '/nutrition' },
  ];

  const company = [
    { label: 'About Us', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Press', to: '/' },
  ];

  const support = [
    { label: 'Size Guide', to: '/' },
    { label: 'Track Order', to: '/orders' },
    { label: 'Returns & Exchanges', to: '/' },
    { label: 'FAQ', to: '/' },
  ];

  const socials = [
    { icon: IconInstagram, label: 'Instagram', href: '#' },
    { icon: IconFacebook,  label: 'Facebook',  href: '#' },
    { icon: IconYoutube,   label: 'YouTube',   href: '#' },
    { icon: IconTwitter,   label: 'Twitter',   href: '#' },
  ];

  return (
    <footer className="bg-gray-950 text-white">

      {/* ── CTA Banner ── */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
              Ready to Train Harder?
            </h3>
            <p className="text-white/50 text-sm font-medium">
              Get 10% off your first order — no code needed.
            </p>
          </div>
          <Link
            to="/men"
            className="flex items-center gap-2 bg-white text-black font-bold px-7 py-3.5 rounded-xl hover:bg-gray-100 transition-all shrink-0 group"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-black -rotate-45" />
              </div>
              <span className="font-black text-xl tracking-widest font-mono">
                FIGHTFLEX
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-7 max-w-xs">
              Premium sportswear crafted for fighters, athletes, and champions. 
              Train hard. Fight smart.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/15 rounded-lg flex items-center justify-center text-white/50 hover:bg-white hover:text-black hover:border-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-5">
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/70 hover:text-white font-medium transition-colors hover:translate-x-0.5 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-white transition-all duration-200 inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {support.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm text-white/70 hover:text-white font-medium transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-white transition-all duration-200 inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-5">
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                <span className="text-sm text-white/60 leading-relaxed">
                  Block 14, Gulshan-e-Iqbal,<br />Karachi, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-white/30 shrink-0" />
                <a href="tel:+923001234567" className="text-sm text-white/60 hover:text-white transition-colors">
                  +92 300 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-white/30 shrink-0" />
                <a href="mailto:hello@fightflex.pk" className="text-sm text-white/60 hover:text-white transition-colors">
                  hello@fightflex.pk
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30 font-medium">
            © {currentYear} FightFlex. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {['Privacy Policy', 'Terms of Use', 'Cookies'].map(item => (
              <a key={item} href="#" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
