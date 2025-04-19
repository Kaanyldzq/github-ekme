/*
 * Sıralama (En çok beğenilenden en az beğenilene doğru) (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş otel sıralama bileşeni.
 * Bu bileşen, kullanıcıların otelleri/tatil seçeneklerini çeşitli kriterlere göre sıralamalarını sağlar.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Rating,
  Stack,
  Button
} from '@mui/material';
import {
  Sort as SortIcon,
  ThumbUp as ThumbUpIcon,
  Star as StarIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// CSS Stilleri
const styles = `
.sorting-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.sorting-card {
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 24px !important;
  background-color: white !important;
  transition: all 0.3s ease !important;
}

.sorting-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
}

.sorting-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
  padding: 16px !important;
  border-bottom: 1px solid #e0e0e0;
}

.sorting-title {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #333 !important;
  margin-bottom: 8px !important;
  display: flex;
  align-items: center;
}

.sorting-title-icon {
  margin-right: 8px !important;
  color: #1976d2 !important;
}

.sorting-subtitle {
  color: #666 !important;
  font-size: 1rem !important;
}

.sorting-content {
  padding: 16px !important;
}

.sorting-form-control {
  margin-bottom: 16px !important;
  min-width: 250px !important;
}

.hotel-item {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  position: relative;
}

.hotel-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.hotel-name {
  font-weight: 600 !important;
  margin-bottom: 8px !important;
  font-size: 1.2rem !important;
  color: #1976d2 !important;
  display: flex;
  align-items: center;
}

.hotel-rating {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.hotel-price {
  margin-top: 8px !important;
  font-weight: 600 !important;
  color: #2e7d32 !important;
}

.hotel-likes {
  display: flex;
  align-items: center;
  margin-top: 8px;
  color: #e91e63;
  font-weight: 500;
}

.like-icon {
  margin-right: 4px !important;
  color: #e91e63 !important;
}

.hotel-location {
  margin-top: 4px !important;
  color: #757575 !important;
  font-size: 0.9rem !important;
}

.hotel-type {
  color: #555 !important;
  font-size: 0.9rem !important;
  margin-bottom: 8px !important;
}

.hotel-feature-chip {
  margin-right: 8px !important;
  margin-bottom: 8px !important;
  background-color: #f5f5f5 !important;
}

.sort-info-tooltip {
  max-width: 300px !important;
  font-size: 0.85rem !important;
}

.sorting-description {
  margin-top: 8px !important;
  margin-bottom: 16px !important;
  padding: 8px 12px !important;
  background-color: #f5f7fa !important;
  border-radius: 4px !important;
  border-left: 4px solid #1976d2 !important;
}

.sorting-description-icon {
  color: #1976d2 !important;
  margin-right: 8px !important;
  font-size: 1.2rem !important;
}

.sorting-trending-icon {
  margin-left: 8px !important;
  font-size: 1.2rem !important;
}

.trending-up {
  color: #4caf50 !important;
}

.trending-down {
  color: #f44336 !important;
}

.view-details-button {
  margin-top: 8px !important;
  text-transform: none !important;
}

@media (max-width: 600px) {
  .sorting-content {
    padding: 12px !important;
  }
  
  .hotel-item {
    padding: 12px;
  }
}
`;

// Demo hotel verileri
const demoHotels = [
  {
    id: 1,
    name: "Royal Paradise Resort",
    rating: 4.8,
    price: 3500,
    likes: 1240,
    location: "Antalya, Kemer",
    type: "Resort & Spa",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    features: ["Denize Sıfır", "Havuz", "Aquapark", "Spa", "All Inclusive"],
    trending: true,
    trendDirection: "up"
  },
  {
    id: 2,
    name: "Blue Lagoon Hotel",
    rating: 4.5,
    price: 2800,
    likes: 890,
    location: "Muğla, Bodrum",
    type: "Butik Otel",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    features: ["Deniz Manzarası", "Havuz", "Restoran", "Bar"],
    trending: false,
    trendDirection: "neutral"
  },
  {
    id: 3,
    name: "Golden Sands Resort",
    rating: 4.2,
    price: 2200,
    likes: 650,
    location: "İzmir, Çeşme",
    type: "Otel",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
    features: ["Plaja Yakın", "Havuz", "Restoran", "Otopark"],
    trending: true,
    trendDirection: "down"
  },
  {
    id: 4,
    name: "Mountain View Lodge",
    rating: 4.7,
    price: 4200,
    likes: 920,
    location: "Bolu, Abant",
    type: "Dağ Evi",
    image: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7",
    features: ["Dağ Manzarası", "Şömine", "Jakuzi", "Özel Havuz"],
    trending: true,
    trendDirection: "up"
  },
  {
    id: 5,
    name: "Sunset Beach Hotel",
    rating: 4.0,
    price: 1800,
    likes: 450,
    location: "Aydın, Didim",
    type: "Otel",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9",
    features: ["Denize Yakın", "Havuz", "Restoran"],
    trending: false,
    trendDirection: "neutral"
  }
];

// Sıralama bileşeni
const SortingComponent = () => {
  const [hotels, setHotels] = useState([]);
  const [sortOption, setSortOption] = useState('likesDesc');
  const [loading, setLoading] = useState(true);

  // Otelleri yükle (gerçek uygulamada API'den alınacak)
  useEffect(() => {
    // API çağrısını simüle ediyoruz
    const timer = setTimeout(() => {
      setHotels(demoHotels);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sıralama seçeneği değiştiğinde otelleri sırala
  useEffect(() => {
    if (hotels.length > 0) {
      sortHotels(sortOption);
    }
  }, [sortOption]);

  // Sıralama seçeneği değiştiğinde çağrılır
  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // Otelleri belirtilen kritere göre sırala
  const sortHotels = (option) => {
    const sortedHotels = [...hotels];
    
    switch (option) {
      case 'likesDesc':
        // Beğenilere göre azalan sıralama (en çok beğenilenden en az beğenilene)
        sortedHotels.sort((a, b) => b.likes - a.likes);
        break;
      case 'likesAsc':
        // Beğenilere göre artan sıralama (en az beğenilenden en çok beğenilene)
        sortedHotels.sort((a, b) => a.likes - b.likes);
        break;
      case 'ratingDesc':
        // Puanlara göre azalan sıralama (en yüksek puandan en düşük puana)
        sortedHotels.sort((a, b) => b.rating - a.rating);
        break;
      case 'ratingAsc':
        // Puanlara göre artan sıralama (en düşük puandan en yüksek puana)
        sortedHotels.sort((a, b) => a.rating - b.rating);
        break;
      case 'priceDesc':
        // Fiyatlara göre azalan sıralama (en yüksek fiyattan en düşük fiyata)
        sortedHotels.sort((a, b) => b.price - a.price);
        break;
      case 'priceAsc':
        // Fiyatlara göre artan sıralama (en düşük fiyattan en yüksek fiyata)
        sortedHotels.sort((a, b) => a.price - b.price);
        break;
      case 'trending':
        // Trend olanlara göre sıralama
        sortedHotels.sort((a, b) => {
          // Önce trend olanları getir
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          
          // Her ikisi de trend ise, trend yönüne göre sırala
          if (a.trending && b.trending) {
            // Yükselen trendleri önce getir
            if (a.trendDirection === 'up' && b.trendDirection !== 'up') return -1;
            if (a.trendDirection !== 'up' && b.trendDirection === 'up') return 1;
            
            // Sonra düşen trendleri getir
            if (a.trendDirection === 'down' && b.trendDirection !== 'down') return -1;
            if (a.trendDirection !== 'down' && b.trendDirection === 'down') return 1;
          }
          
          // Diğer durumlarda beğeni sayısına göre sırala
          return b.likes - a.likes;
        });
        break;
      default:
        sortedHotels.sort((a, b) => b.likes - a.likes);
    }
    
    setHotels(sortedHotels);
  };

  // Beğeni sayısı formatla
  const formatLikes = (likes) => {
    if (likes >= 1000) {
      return (likes / 1000).toFixed(1) + 'k';
    }
    return likes;
  };

  // Sıralama açıklaması
  const getSortDescription = () => {
    switch (sortOption) {
      case 'likesDesc':
        return 'Oteller en çok beğenilenden en az beğenilene doğru sıralanıyor';
      case 'likesAsc':
        return 'Oteller en az beğenilenden en çok beğenilene doğru sıralanıyor';
      case 'ratingDesc':
        return 'Oteller en yüksek puandan en düşük puana doğru sıralanıyor';
      case 'ratingAsc':
        return 'Oteller en düşük puandan en yüksek puana doğru sıralanıyor';
      case 'priceDesc':
        return 'Oteller en yüksek fiyattan en düşük fiyata doğru sıralanıyor';
      case 'priceAsc':
        return 'Oteller en düşük fiyattan en yüksek fiyata doğru sıralanıyor';
      case 'trending':
        return 'Oteller trend olanlara öncelik verilerek sıralanıyor';
      default:
        return 'Oteller en çok beğenilenden en az beğenilene doğru sıralanıyor';
    }
  };

  return (
    <div className="sorting-container">
      <style>{styles}</style>
      
      <Card className="sorting-card">
        <Box className="sorting-header">
          <Typography variant="h5" className="sorting-title">
            <SortIcon className="sorting-title-icon" />
            Otel Sıralama
          </Typography>
          <Typography variant="body1" className="sorting-subtitle">
            Tatil seçeneklerini tercihlerinize göre sıralayın
          </Typography>
        </Box>
        
        <CardContent className="sorting-content">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl className="sorting-form-control" fullWidth>
                <InputLabel id="sort-select-label">Sıralama Kriteri</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortOption}
                  label="Sıralama Kriteri"
                  onChange={handleSortChange}
                >
                  <MenuItem value="likesDesc">En Çok Beğenilene Göre</MenuItem>
                  <MenuItem value="likesAsc">En Az Beğenilene Göre</MenuItem>
                  <MenuItem value="ratingDesc">En Yüksek Puana Göre</MenuItem>
                  <MenuItem value="ratingAsc">En Düşük Puana Göre</MenuItem>
                  <MenuItem value="priceDesc">En Yüksek Fiyata Göre</MenuItem>
                  <MenuItem value="priceAsc">En Düşük Fiyata Göre</MenuItem>
                  <MenuItem value="trending">Trend Olanlara Göre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={8}>
              <Tooltip 
                title={
                  <Typography className="sort-info-tooltip">
                    Tatil seçeneklerinizi çeşitli kriterlere göre sıralayarak size en uygun olan seçeneği bulabilirsiniz. 
                    En çok beğenilen oteller genel kullanıcı memnuniyetini yansıtır.
                  </Typography>
                } 
                placement="bottom"
                arrow
              >
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="small" color="info" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          
          <Paper className="sorting-description" elevation={0}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon className="sorting-description-icon" />
              <Typography variant="body2">
                {getSortDescription()}
              </Typography>
            </Box>
          </Paper>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mt: 2 }}>
            {hotels.map((hotel) => (
              <Paper key={hotel.id} className="hotel-item" elevation={0}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={8}>
                    <Typography variant="h6" className="hotel-name">
                      {hotel.name}
                      {hotel.trending && (
                        <Box component="span" sx={{ ml: 1 }}>
                          {hotel.trendDirection === 'up' ? (
                            <TrendingUpIcon className="sorting-trending-icon trending-up" />
                          ) : hotel.trendDirection === 'down' ? (
                            <TrendingDownIcon className="sorting-trending-icon trending-down" />
                          ) : null}
                        </Box>
                      )}
                    </Typography>
                    
                    <Typography variant="body2" className="hotel-type">
                      {hotel.type}
                    </Typography>
                    
                    <Box className="hotel-rating">
                      <Rating 
                        value={hotel.rating} 
                        precision={0.1} 
                        readOnly 
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        {hotel.rating.toFixed(1)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" className="hotel-location">
                      {hotel.location}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                      {hotel.features.map((feature, index) => (
                        <Chip 
                          key={index} 
                          label={feature} 
                          size="small" 
                          className="hotel-feature-chip"
                        />
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" className="hotel-price">
                          {hotel.price.toLocaleString('tr-TR')} TL
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          gecelik / kişi başı
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="body2" className="hotel-likes">
                          <ThumbUpIcon className="like-icon" fontSize="small" />
                          {formatLikes(hotel.likes)} beğeni
                        </Typography>
                        
                        <Button 
                          variant="outlined" 
                          size="small" 
                          className="view-details-button"
                          fullWidth
                          sx={{ mt: 1 }}
                        >
                          Detayları Gör
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

// Sıralama Demo Uygulaması
const SortingDemo = () => {
  return (
    <Box sx={{ my: 4 }}>
      <SortingComponent />
    </Box>
  );
};

export { SortingComponent, SortingDemo };
export default SortingComponent; 