import { useState, useEffect } from 'react';
import './ImageSlider.css';

import slide1 from '../assets/slider/image.jpeg';
import slide2 from '../assets/slider/images.jpeg';
import slide3 from '../assets/slider/imagess.jpeg';

const images = [slide1, slide2, slide3];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <img src={images[currentIndex]} alt="slide" className="slider-image" />
      <div className="slider-overlay">
        <h1>HALI SAHA & SOSYAL TESİSLER</h1>
        <p>14-16 Yaş Turnuvamız Yakında Başlıyor</p>
        <button className="slider-button">BİLGİ ALIN</button>
      </div>
      <button className="nav-button left" onClick={goToPrevious}>❮</button>
      <button className="nav-button right" onClick={goToNext}>❯</button>
    </div>
  );
};

export default ImageSlider;
