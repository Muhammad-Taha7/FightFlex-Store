import React from 'react';

const ClearanceBanner = () => {
  // High-res Shopify image URL without low-res width constraint
  const bannerImage = "https://anone-store-demo.myshopify.com/cdn/shop/files/banner4_86c1c81c-6880-49ca-b9ef-793c3b0ce287.png?v=1639617803";

  return (
    <section className="relative w-full min-h-[300px] sm:min-h-[420px] md:min-h-[500px] lg:min-h-[580px] flex items-center overflow-hidden bg-neutral-900 select-none">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={bannerImage}
          alt="End of season gymwear clearance sale"
          className="w-full h-full object-cover object-[70%_center] sm:object-center lg:object-[center_25%]"
          loading="eager"
        />
        
        {/* Dual Gradient Overlay for Maximum Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 sm:via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 md:px-16 w-full">
        <div className="max-w-[260px] xs:max-w-xs sm:max-w-lg lg:max-w-xl space-y-2.5 sm:space-y-4 md:space-y-6 text-white drop-shadow-sm">
          
          {/* Main Headline */}
          <h2 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            End of season <br className="hidden sm:inline" />
            clearance sale <br />
            <span>up to 30%</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-200 text-xs sm:text-base font-normal sm:font-medium tracking-wide opacity-90 leading-snug">
            Stock is limited. Order now to avoid disappointment.
          </p>

          {/* Call-to-Action Button */}
          <div className="pt-1 sm:pt-2">
            <button className="px-5 py-2.5 sm:px-8 sm:py-3.5 md:px-10 md:py-4 border-2 border-white text-white font-bold text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase bg-transparent hover:bg-white hover:text-black active:scale-95 transition-all duration-300 ease-in-out cursor-pointer shadow-md">
              SHOP NOW
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ClearanceBanner;