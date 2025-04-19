/*
 * Kampanya ekle (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş kampanya ekleme bileşeni.
 * Bu bileşen, yetkili kullanıcıların tatil platformuna kampanya eklemelerini sağlar.
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  LocalOffer as LocalOfferIcon,
  CalendarToday as CalendarIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import trLocale from 'date-fns/locale/tr';

// Dahili CSS Stilleri
const styles = `
.campaign-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.campaign-card {
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 24px !important;
  background-color: white !important;
  transition: all 0.3s ease !important;
}

.campaign-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-2px);
}

.campaign-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
  padding: 16px !important;
  border-bottom: 1px solid #e0e0e0;
}

.campaign-title {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #333 !important;
  margin-bottom: 8px !important;
}

.campaign-subtitle {
  color: #666 !important;
  font-size: 1rem !important;
}

.campaign-form {
  padding: 24px !important;
}

.campaign-input {
  margin-bottom: 16px !important;
  width: 100% !important;
}

.campaign-button {
  background-color: #1976d2 !important;
  color: white !important;
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-size: 1rem !important;
  transition: all 0.2s ease !important;
}

.campaign-button:hover {
  background-color: #1565c0 !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
}

.campaign-list {
  margin-top: 32px;
}

.campaign-item {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.campaign-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.campaign-image-preview {
  width: 100%;
  height: 140px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.campaign-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.campaign-image-upload {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.campaign-image-upload:hover {
  border-color: #1976d2;
  background-color: rgba(25, 118, 210, 0.05);
}

.campaign-chip {
  margin-right: 8px !important;
  margin-bottom: 8px !important;
  background-color: #e3f2fd !important;
  color: #0d47a1 !important;
  font-weight: 500 !important;
}

.discount-chip {
  background-color: #fce4ec !important;
  color: #c2185b !important;
  font-weight: 700 !important;
}

@media (max-width: 600px) {
  .campaign-form {
    padding: 16px !important;
  }
}
`;

// Demo kampanya verileri
const demoCampaigns = [
  {
    id: 1,
    title: "Yaz Sezonu Erken Rezervasyon",
    description: "Yaz tatili için erken rezervasyon yapanlara özel %25 indirim fırsatı!",
    discountRate: 25,
    discountType: "percent",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-06-30"),
    targetHotels: ["Royal Hotel", "Palm Resort", "Blue Paradise"],
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGhvdGVsJTIwc3VtbWVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    isActive: true
  },
  {
    id: 2,
    title: "Kış Tatili Fırsatı",
    description: "Kış tatili paketlerinde 2 gece konaklamaya 1 gece ücretsiz!",
    discountRate: 33,
    discountType: "percent",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2025-02-28"),
    targetHotels: ["Mountain Lodge", "Snowy Resort", "Winter Palace"],
    imageUrl: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c25vdyUyMGhvdGVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
    isActive: true
  }
];

// Demo otel verileri
const demoHotels = [
  { id: 1, name: "Royal Hotel" },
  { id: 2, name: "Palm Resort" },
  { id: 3, name: "Blue Paradise" },
  { id: 4, name: "Mountain Lodge" },
  { id: 5, name: "Snowy Resort" },
  { id: 6, name: "Winter Palace" },
  { id: 7, name: "Sunset Beach Resort" },
  { id: 8, name: "Grand Plaza Hotel" },
  { id: 9, name: "Riverside Inn" },
  { id: 10, name: "Ocean View Hotel" }
];

const CampaignManagementComponent = () => {
  const [campaigns, setCampaigns] = useState(demoCampaigns);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    discountRate: 10,
    discountType: 'percent',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    targetHotels: [],
    imageUrl: '',
    isActive: true
  });
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setEditingCampaign(null);
    setNewCampaign({
      title: '',
      description: '',
      discountRate: 10,
      discountType: 'percent',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      targetHotels: [],
      imageUrl: '',
      isActive: true
    });
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setNewCampaign({
      ...campaign,
      startDate: new Date(campaign.startDate),
      endDate: new Date(campaign.endDate)
    });
    setOpenDialog(true);
  };
  
  const handleDeleteCampaign = (campaignId) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    setSnackbar({
      open: true,
      message: 'Kampanya başarıyla silindi',
      severity: 'success'
    });
  };
  
  const handleSaveCampaign = () => {
    if (editingCampaign) {
      // Kampanyayı güncelle
      setCampaigns(campaigns.map(campaign => 
        campaign.id === editingCampaign.id 
          ? { ...newCampaign, id: campaign.id } 
          : campaign
      ));
      setSnackbar({
        open: true,
        message: 'Kampanya başarıyla güncellendi',
        severity: 'success'
      });
    } else {
      // Yeni kampanya ekle
      setCampaigns([
        ...campaigns,
        {
          ...newCampaign,
          id: campaigns.length > 0 ? Math.max(...campaigns.map(c => c.id)) + 1 : 1
        }
      ]);
      setSnackbar({
        open: true,
        message: 'Yeni kampanya başarıyla eklendi',
        severity: 'success'
      });
    }
    
    setOpenDialog(false);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCampaign({ ...newCampaign, [name]: value });
  };
  
  const handleToggleActive = (e) => {
    setNewCampaign({ ...newCampaign, isActive: e.target.checked });
  };
  
  const handleDateChange = (fieldName, newDate) => {
    setNewCampaign({ ...newCampaign, [fieldName]: newDate });
  };
  
  const handleHotelSelect = (e) => {
    const { value } = e.target;
    setNewCampaign({ ...newCampaign, targetHotels: value });
  };
  
  const handleImageUpload = (e) => {
    // Gerçek uygulamada bir dosya yükleme servisi kullanılır
    // Bu demo için sadece bir URL simülasyonu yapılıyor
    const file = e.target.files[0];
    if (file) {
      // Demo amaçlı sabit bir URL kullanıyoruz
      const demoImageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60";
      setNewCampaign({ ...newCampaign, imageUrl: demoImageUrl });
    }
  };
  
  // Kampanyanın aktif olup olmadığını kontrol etme
  const isCampaignActive = (campaign) => {
    const now = new Date();
    return campaign.isActive && 
           new Date(campaign.startDate) <= now && 
           new Date(campaign.endDate) >= now;
  };
  
  // Kampanyanın durumunu belirleme (Aktif, Gelecek, Sona Ermiş)
  const getCampaignStatus = (campaign) => {
    const now = new Date();
    
    if (!campaign.isActive) {
      return { text: "Pasif", color: "#9e9e9e" };
    }
    
    if (new Date(campaign.startDate) > now) {
      return { text: "Gelecek", color: "#ff9800" };
    }
    
    if (new Date(campaign.endDate) < now) {
      return { text: "Sona Ermiş", color: "#f44336" };
    }
    
    return { text: "Aktif", color: "#4caf50" };
  };
  
  return (
    <div className="campaign-container">
      <style>{styles}</style>
      
      <Card className="campaign-card">
        <Box className="campaign-header">
          <Typography variant="h5" className="campaign-title">
            Kampanya Yönetimi
          </Typography>
          <Typography variant="body1" className="campaign-subtitle">
            Tatil platformu için kampanyaları ekleyin, düzenleyin ve yönetin
          </Typography>
        </Box>
        
        <CardContent>
          <Button 
            variant="contained"
            className="campaign-button"
            onClick={handleOpenDialog}
            startIcon={<AddIcon />}
          >
            Yeni Kampanya Ekle
          </Button>
          
          <Divider sx={{ my: 3 }} />
          
          <div className="campaign-list">
            {campaigns.map(campaign => {
              const status = getCampaignStatus(campaign);
              
              return (
                <Paper key={campaign.id} className="campaign-item" elevation={1}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <div className="campaign-image-preview">
                        {campaign.imageUrl ? (
                          <img src={campaign.imageUrl} alt={campaign.title} />
                        ) : (
                          <ImageIcon sx={{ fontSize: 60, color: '#ccc' }} />
                        )}
                      </div>
                    </Grid>
                    
                    <Grid item xs={12} sm={9}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" gutterBottom>
                          {campaign.title}
                        </Typography>
                        
                        <Chip 
                          label={status.text} 
                          size="small"
                          style={{ backgroundColor: status.color, color: 'white' }}
                        />
                      </Box>
                      
                      <Chip 
                        label={`%${campaign.discountRate} İndirim`} 
                        size="small"
                        className="discount-chip campaign-chip"
                        icon={<LocalOfferIcon />}
                      />
                      
                      <Chip 
                        label={`${new Date(campaign.startDate).toLocaleDateString('tr-TR')} - ${new Date(campaign.endDate).toLocaleDateString('tr-TR')}`} 
                        size="small"
                        className="campaign-chip"
                        icon={<CalendarIcon />}
                      />
                      
                      <Typography variant="body1" paragraph sx={{ mt: 1 }}>
                        {campaign.description}
                      </Typography>
                      
                      <Box sx={{ mt: 2, mb: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Hedef Oteller:
                        </Typography>
                        <Box>
                          {campaign.targetHotels.map((hotel, index) => (
                            <Chip 
                              key={index}
                              label={hotel} 
                              size="small"
                              className="campaign-chip"
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button 
                          size="small" 
                          startIcon={<EditIcon />}
                          onClick={() => handleEditCampaign(campaign)}
                        >
                          Düzenle
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteCampaign(campaign.id)}
                        >
                          Sil
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
            
            {campaigns.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <LocalOfferIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Henüz kampanya bulunmuyor
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  İlk kampanyanızı eklemek için "Yeni Kampanya Ekle" düğmesine tıklayın
                </Typography>
              </Box>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Kampanya Ekleme/Düzenleme Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCampaign ? 'Kampanyayı Düzenle' : 'Yeni Kampanya Ekle'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kampanya Başlığı"
                  name="title"
                  value={newCampaign.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Kampanya Açıklaması"
                  name="description"
                  value={newCampaign.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="İndirim Oranı"
                  name="discountRate"
                  type="number"
                  value={newCampaign.discountRate}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">%</InputAdornment>,
                  }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>İndirim Tipi</InputLabel>
                  <Select
                    value={newCampaign.discountType}
                    name="discountType"
                    onChange={handleInputChange}
                    label="İndirim Tipi"
                  >
                    <MenuItem value="percent">Yüzde İndirim (%)</MenuItem>
                    <MenuItem value="fixed">Sabit Tutar İndirimi (TL)</MenuItem>
                    <MenuItem value="freeNight">Ücretsiz Gece</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                  <DatePicker
                    label="Başlangıç Tarihi"
                    value={newCampaign.startDate}
                    onChange={(newDate) => handleDateChange('startDate', newDate)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                  <DatePicker
                    label="Bitiş Tarihi"
                    value={newCampaign.endDate}
                    onChange={(newDate) => handleDateChange('endDate', newDate)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Hedef Oteller</InputLabel>
                  <Select
                    multiple
                    value={newCampaign.targetHotels}
                    onChange={handleHotelSelect}
                    label="Hedef Oteller"
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} className="campaign-chip" />
                        ))}
                      </Box>
                    )}
                  >
                    {demoHotels.map((hotel) => (
                      <MenuItem key={hotel.id} value={hotel.name}>
                        {hotel.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Paper className="campaign-image-upload" variant="outlined">
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="campaign-image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="campaign-image-upload">
                    <Box sx={{ textAlign: 'center' }}>
                      {newCampaign.imageUrl ? (
                        <Box sx={{ mb: 2, maxHeight: '150px', overflow: 'hidden' }}>
                          <img 
                            src={newCampaign.imageUrl} 
                            alt="Kampanya görseli" 
                            style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover' }}
                          />
                        </Box>
                      ) : (
                        <ImageIcon sx={{ fontSize: 60, color: '#ccc', mb: 1 }} />
                      )}
                      <Typography variant="body1" gutterBottom>
                        {newCampaign.imageUrl ? 'Görseli değiştir' : 'Kampanya görseli yükle'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Önerilen boyut: 1200x600px, maksimum 2MB
                      </Typography>
                    </Box>
                  </label>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={newCampaign.isActive} 
                      onChange={handleToggleActive}
                      color="primary"
                    />
                  }
                  label="Kampanyayı aktif olarak yayınla"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDialog}
            startIcon={<CancelIcon />}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCampaign}
            className="campaign-button"
            disabled={!newCampaign.title || !newCampaign.description || newCampaign.targetHotels.length === 0}
            startIcon={<SaveIcon />}
          >
            {editingCampaign ? 'Güncelle' : 'Kaydet'}
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
const KampanyaEkleDemo = () => {
  return <CampaignManagementComponent />;
};

export { CampaignManagementComponent, KampanyaEkleDemo };
export default CampaignManagementComponent; 