import React from 'react';
import { Box, Typography, Slider, TextField } from '@mui/material';
import '../styles/PriceFilter.css';

const PriceFilter = ({ priceRange, setPriceRange, minPrice, maxPrice }) => {
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

export default PriceFilter; 