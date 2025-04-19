/*
 * Fiyat Aralığına Göre Filtreleme (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş fiyat aralığı filtreleme bileşeni.
 * Bu bileşen, kullanıcıların minimum ve maksimum fiyat aralığını belirlemelerine olanak tanır.
 */

import React, { useState } from 'react';
import { Box, Typography, Slider, TextField } from '@mui/material';

// Dahili CSS Stilleri
const styles = `
.price-filter-container {
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
}

.price-inputs {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 10px;
}

.price-input {
  flex: 1;
}

.price-separator {
  margin: 0 8px;
  color: #666;
}

.price-slider {
  margin-bottom: 8px;
  color: #1976d2;
}

.price-range-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

/* Responsive styles */
@media (max-width: 600px) {
  .price-filter-container {
    padding: 12px;
  }
  
  .price-inputs {
    flex-direction: column;
    align-items: stretch;
  }
  
  .price-separator {
    display: none;
  }
}
`;

const PriceFilter = ({ priceRange, setPriceRange, minPrice = 0, maxPrice = 10000 }) => {
  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleMinInputChange = (event) => {
    const value = Number(event.target.value);
    const newMin = Math.max(minPrice, Math.min(value, priceRange[1] - 100));
    setPriceRange([newMin, priceRange[1]]);
  };

  const handleMaxInputChange = (event) => {
    const value = Number(event.target.value);
    const newMax = Math.min(maxPrice, Math.max(value, priceRange[0] + 100));
    setPriceRange([priceRange[0], newMax]);
  };

  const formatPrice = (value) => {
    return `${value.toLocaleString('tr-TR')} ₺`;
  };

  return (
    <div className="price-filter-container">
      <style>{styles}</style>
      <Typography variant="h6" gutterBottom>
        Fiyat Aralığı
      </Typography>
      
      <div className="price-inputs">
        <TextField
          className="price-input"
          label="Min Fiyat"
          value={priceRange[0]}
          onChange={handleMinInputChange}
          type="number"
          size="small"
          InputProps={{
            inputProps: { min: minPrice, max: priceRange[1] - 100 }
          }}
        />
        <span className="price-separator">-</span>
        <TextField
          className="price-input"
          label="Max Fiyat"
          value={priceRange[1]}
          onChange={handleMaxInputChange}
          type="number"
          size="small"
          InputProps={{
            inputProps: { min: priceRange[0] + 100, max: maxPrice }
          }}
        />
      </div>
      
      <Slider
        className="price-slider"
        value={priceRange}
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        valueLabelFormat={formatPrice}
        min={minPrice}
        max={maxPrice}
        step={100}
      />
      
      <div className="price-range-labels">
        <Typography variant="body2" color="textSecondary">
          {formatPrice(minPrice)}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatPrice(maxPrice)}
        </Typography>
      </div>
    </div>
  );
};

// Örnek Kullanım
const FiyatFiltrelemeDemo = () => {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  
  return (
    <div>
      <PriceFilter 
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        minPrice={0}
        maxPrice={10000}
      />
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
        <Typography variant="body1">
          Seçilen fiyat aralığı: {priceRange[0]} - {priceRange[1]} TL
        </Typography>
      </div>
    </div>
  );
};

export { PriceFilter, FiyatFiltrelemeDemo };
export default PriceFilter; 