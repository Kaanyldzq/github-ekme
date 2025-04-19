/*
 * Kalınan odaya puan verebilme (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş otel/oda puanlama bileşeni.
 * Bu bileşen, kullanıcıların konakladıkları odalara yorum yapıp puan vermelerini sağlar.
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  Avatar,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem
} from '@mui/material';
import { 
  Star as StarIcon,
  Comment as CommentIcon,
  Sort as SortIcon,
  ThumbUp as ThumbUpIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// Dahili CSS Stilleri
const styles = `
.review-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.review-card {
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 24px !important;
  background-color: white !important;
  transition: all 0.3s ease !important;
}

.review-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.review-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
  padding: 16px !important;
  border-bottom: 1px solid #e0e0e0;
}

.review-title {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #333 !important;
  margin-bottom: 8px !important;
}

.review-subtitle {
  color: #666 !important;
  font-size: 1rem !important;
}

.review-form {
  padding: 24px !important;
}

.review-input {
  margin-bottom: 16px !important;
  width: 100% !important;
}

.rating-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.large-rating {
  font-size: 2.5rem !important;
}

.review-button {
  background-color: #1976d2 !important;
  color: white !important;
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-size: 1rem !important;
  transition: all 0.2s ease !important;
}

.review-button:hover {
  background-color: #1565c0 !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
}

.reviews-list {
  margin-top: 32px;
}

.review-list-item {
  padding: 16px !important;
  border-bottom: 1px solid #eee !important;
}

.review-list-item:last-child {
  border-bottom: none !important;
}

.review-user {
  font-weight: 600 !important;
  margin-right: 8px !important;
}

.review-date {
  color: #888 !important;
  font-size: 0.85rem !important;
}

.review-avatar {
  background-color: #1976d2 !important;
  margin-right: 16px !important;
}

.review-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.review-actions button {
  padding: 4px 8px !important;
  font-size: 0.85rem !important;
}

.review-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.review-filter {
  min-width: 150px !important;
}

.empty-reviews {
  text-align: center;
  padding: 32px 16px;
}

.empty-icon {
  font-size: 4rem !important;
  color: #ccc !important;
  margin-bottom: 16px !important;
}

.room-chip {
  margin-right: 8px !important;
  margin-bottom: 8px !important;
  background-color: #e3f2fd !important;
  color: #0d47a1 !important;
  font-weight: 500 !important;
}

@media (max-width: 600px) {
  .review-filters {
    flex-direction: column;
    gap: 12px;
  }
  
  .review-filter {
    width: 100% !important;
  }
  
  .review-form {
    padding: 16px !important;
  }
}
`;

// Demo verileri - gerçek uygulamada API'den alınacak
const demoRooms = [
  { id: 1, name: "Standart Oda", price: 2000 },
  { id: 2, name: "Deluxe Oda", price: 3000 },
  { id: 3, name: "Suit Oda", price: 4500 }
];

const demoReviews = [
  {
    id: 1,
    user: "Ahmet Yılmaz",
    roomId: 1,
    roomName: "Standart Oda",
    rating: 4,
    comment: "Odanın manzarası harikaydı ve temizlik iyiydi. Ancak ses yalıtımı biraz zayıftı.",
    date: "2024-04-15",
    isOwn: true
  },
  {
    id: 2,
    user: "Ayşe Demir",
    roomId: 2,
    roomName: "Deluxe Oda",
    rating: 5,
    comment: "Muhteşem bir deneyimdi! Oda çok genişti ve personel çok yardımcıydı.",
    date: "2024-03-20",
    isOwn: false
  },
  {
    id: 3,
    user: "Mehmet Kaya",
    roomId: 3,
    roomName: "Suit Oda",
    rating: 3,
    comment: "Oda güzeldi ama hizmet beklediğim gibi değildi. Beklentimi karşılamadı.",
    date: "2024-03-10",
    isOwn: false
  }
];

const RoomReviewComponent = () => {
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviews, setReviews] = useState(demoReviews);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    roomId: '',
    roomName: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [sortReviews, setSortReviews] = useState('newest');
  const [filterRating, setFilterRating] = useState(0);
  const [filterRoom, setFilterRoom] = useState('');
  const [editingReview, setEditingReview] = useState(null);

  const handleOpenReviewDialog = () => {
    setOpenReviewDialog(true);
    setNewReview({
      rating: 0,
      comment: '',
      roomId: '',
      roomName: ''
    });
    setEditingReview(null);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  const handleRoomChange = (event) => {
    const roomId = event.target.value;
    const selectedRoom = demoRooms.find(room => room.id === roomId);
    setNewReview({
      ...newReview,
      roomId: roomId,
      roomName: selectedRoom?.name || ''
    });
  };

  const handleReviewSubmit = () => {
    if (editingReview) {
      // Mevcut yorumu güncelle
      const updatedReviews = reviews.map(review => 
        review.id === editingReview.id 
          ? { 
              ...review, 
              rating: newReview.rating, 
              comment: newReview.comment,
              roomId: newReview.roomId,
              roomName: newReview.roomName
            } 
          : review
      );
      setReviews(updatedReviews);
      setSnackbar({
        open: true,
        message: 'Yorumunuz başarıyla güncellendi',
        severity: 'success'
      });
    } else {
      // Yeni yorum ekle
      const review = {
        id: reviews.length + 1,
        user: "Kaan Yıldız", // Aktif kullanıcı adı, gerçek uygulamada auth sisteminden alınır
        roomId: newReview.roomId,
        roomName: newReview.roomName,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        isOwn: true
      };
      
      setReviews([review, ...reviews]);
      setSnackbar({
        open: true,
        message: 'Yorumunuz başarıyla eklendi',
        severity: 'success'
      });
    }
    
    setOpenReviewDialog(false);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview({
      rating: review.rating,
      comment: review.comment,
      roomId: review.roomId,
      roomName: review.roomName
    });
    setOpenReviewDialog(true);
  };

  const handleDeleteReview = (reviewId) => {
    setReviews(reviews.filter(review => review.id !== reviewId));
    setSnackbar({
      open: true,
      message: 'Yorumunuz başarıyla silindi',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Filtreleme ve sıralama işlemleri
  const filteredAndSortedReviews = [...reviews]
    .filter(review => filterRating === 0 || review.rating === filterRating)
    .filter(review => filterRoom === '' || review.roomId.toString() === filterRoom)
    .sort((a, b) => {
      if (sortReviews === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortReviews === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } else if (sortReviews === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });

  // Ortalama puanı hesapla
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="review-container">
      <style>{styles}</style>
      
      <Card className="review-card">
        <Box className="review-header">
          <Typography variant="h5" className="review-title">
            Oda Değerlendirmeleri
          </Typography>
          <Typography variant="body1" className="review-subtitle">
            Puan ortalaması: {calculateAverageRating()} / 5 ({reviews.length} değerlendirme)
          </Typography>
        </Box>
        
        <CardContent>
          <Button 
            variant="contained"
            className="review-button"
            onClick={handleOpenReviewDialog}
            startIcon={<CommentIcon />}
          >
            Oda Değerlendir
          </Button>
          
          <Divider sx={{ my: 3 }} />
          
          <Box className="review-filters">
            <FormControl className="review-filter">
              <InputLabel>Sırala</InputLabel>
              <Select
                value={sortReviews}
                onChange={(e) => setSortReviews(e.target.value)}
                label="Sırala"
                size="small"
              >
                <MenuItem value="newest">En Yeni</MenuItem>
                <MenuItem value="oldest">En Eski</MenuItem>
                <MenuItem value="highest">En Yüksek Puan</MenuItem>
                <MenuItem value="lowest">En Düşük Puan</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl className="review-filter">
              <InputLabel>Puan Filtrele</InputLabel>
              <Select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                label="Puan Filtrele"
                size="small"
              >
                <MenuItem value={0}>Tüm Puanlar</MenuItem>
                <MenuItem value={5}>5 Yıldız</MenuItem>
                <MenuItem value={4}>4 Yıldız</MenuItem>
                <MenuItem value={3}>3 Yıldız</MenuItem>
                <MenuItem value={2}>2 Yıldız</MenuItem>
                <MenuItem value={1}>1 Yıldız</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl className="review-filter">
              <InputLabel>Oda Tipi</InputLabel>
              <Select
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
                label="Oda Tipi"
                size="small"
              >
                <MenuItem value="">Tüm Odalar</MenuItem>
                {demoRooms.map(room => (
                  <MenuItem key={room.id} value={room.id.toString()}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <div className="reviews-list">
            {filteredAndSortedReviews.length > 0 ? (
              <List>
                {filteredAndSortedReviews.map(review => (
                  <ListItem key={review.id} className="review-list-item">
                    <Box sx={{ display: 'flex', width: '100%' }}>
                      <Avatar className="review-avatar">
                        {review.user.charAt(0)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                          <Typography variant="subtitle1" className="review-user">
                            {review.user}
                          </Typography>
                          <Chip 
                            label={review.roomName} 
                            size="small"
                            className="room-chip"
                          />
                          <Typography variant="body2" className="review-date">
                            {new Date(review.date).toLocaleDateString('tr-TR')}
                          </Typography>
                        </Box>
                        
                        <Rating 
                          value={review.rating} 
                          readOnly 
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        
                        <Typography variant="body1" gutterBottom>
                          {review.comment}
                        </Typography>
                        
                        {review.isOwn && (
                          <Box className="review-actions">
                            <Button 
                              size="small" 
                              startIcon={<EditIcon />}
                              onClick={() => handleEditReview(review)}
                            >
                              Düzenle
                            </Button>
                            <Button 
                              size="small" 
                              color="error"
                              startIcon={<DeleteIcon />}
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              Sil
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box className="empty-reviews">
                <CommentIcon className="empty-icon" />
                <Typography variant="h6" gutterBottom>
                  Gösterilecek değerlendirme bulunamadı
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Seçilen filtrelerle eşleşen değerlendirme yok
                </Typography>
              </Box>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Değerlendirme Ekleme/Düzenleme Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingReview ? 'Değerlendirmenizi Düzenleyin' : 'Oda Değerlendirmesi Ekleyin'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <FormControl fullWidth className="review-input">
              <InputLabel>Oda Tipi</InputLabel>
              <Select
                value={newReview.roomId}
                onChange={handleRoomChange}
                label="Oda Tipi"
              >
                {demoRooms.map(room => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box className="rating-container">
              <Typography variant="subtitle1" gutterBottom>
                Puanınız
              </Typography>
              <Rating
                value={newReview.rating}
                onChange={(event, newValue) => {
                  setNewReview({ ...newReview, rating: newValue });
                }}
                className="large-rating"
              />
            </Box>
            
            <TextField
              className="review-input"
              multiline
              rows={4}
              label="Yorumunuz"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Oda ile ilgili deneyiminizi paylaşın..."
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleReviewSubmit}
            className="review-button"
            disabled={!newReview.rating || !newReview.comment || !newReview.roomId}
          >
            {editingReview ? 'Güncelle' : 'Gönder'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Bildirim Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

// Kullanım örneği
const OdaPuanlamaDemo = () => {
  return <RoomReviewComponent />;
};

export { RoomReviewComponent, OdaPuanlamaDemo };
export default RoomReviewComponent; 