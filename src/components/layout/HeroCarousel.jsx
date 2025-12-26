import React from 'react';

function HeroCarousel({ children }) {
  return (
    <section className="hero-root">
      <div className="hero-inner">
        <div className="hero-content-wrapper">{children}</div>
      </div>
    </section>
  );
}

export default HeroCarousel;
