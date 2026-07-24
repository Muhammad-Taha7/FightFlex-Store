import React from 'react';

const FitnessGallery = () => {
  const galleryItems = [
    {
      id: 1,
      title: 'Runner Gear',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
      alt: 'Man running on outdoor track in gym hoodie'
    },
    {
      id: 2,
      title: 'Active Wear',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800',
      alt: 'Smiling woman holding water bottle in workout top'
    },
    {
      id: 3,
      title: 'Performance Footwear',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=800',
      alt: 'Running shoes on treadmill'
    },
    {
      id: 4,
      title: 'Strength Training',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      alt: 'Heavy dumbbell workout in dark gym'
    },
  ];

  return (
    <section className="py-6 sm:py-12 px-3 sm:px-6 max-w-7xl mx-auto">
      {/* Mobile par 2 Columns (grid-cols-2), chota gap (gap-3) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
        {galleryItems.map((item) => (
          <div 
            key={item.id} 
            className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-slate-900 aspect-square shadow-sm sm:shadow-md hover:shadow-xl transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.alt}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            
            {/* Dark overlay & Title */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-300 flex items-end p-2.5 sm:p-4">
              <h3 className="text-white text-xs sm:text-base font-semibold sm:font-bold tracking-wide sm:transform sm:translate-y-2 sm:group-hover:translate-y-0 transition-transform duration-300 line-clamp-1">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FitnessGallery;