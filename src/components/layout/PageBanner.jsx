import React from 'react';

function PageBanner({ title, subtitle, eyebrow, image }) {
  return (
    <section className="page-banner">
      <div
        className="page-banner-media"
        aria-hidden="true"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="page-banner-overlay" />
      </div>
      <div className="page-banner-inner">
        <div className="page-banner-content">
          {eyebrow && <div className="page-banner-eyebrow">{eyebrow}</div>}
          <h1 className="page-banner-title">{title}</h1>
          {subtitle && <p className="page-banner-subtitle">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}

export default PageBanner;
