# Fiyat Aralığına Göre Filtreleme (Kaan Yıldız)

React ve Material-UI ile geliştirilmiş fiyat aralığı filtreleme bileşeni.

## İçerik

- `src/components/PriceFilter.js`: Fiyat aralığı filtreleme bileşeni
- `src/styles/PriceFilter.css`: Filtreleme bileşeni için stil dosyası

## Özellikler

- Minimum ve maksimum fiyat aralığı belirleme
- İnteraktif slider kontrolü
- Manuel fiyat girişi yapabilme
- TL para birimi formatlaması
- Duyarlı (responsive) tasarım
- Kullanıcı dostu arayüz

## Kullanım

PriceFilter bileşeni, React uygulamanızın içinde aşağıdaki gibi kullanılabilir:

```jsx
import { useState } from 'react';
import PriceFilter from './components/PriceFilter';

function App() {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  
  return (
    <div>
      <PriceFilter 
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        minPrice={0}
        maxPrice={10000}
      />
      
      <div>
        Seçilen fiyat aralığı: {priceRange[0]} - {priceRange[1]} TL
      </div>
    </div>
  );
}
```

## Gereksinimler

- React 17+
- Material-UI 5+
- CSS Modülleri desteği 