/*
 * Kampanya düzenle (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş kampanya düzenleme bileşeni.
 * Bu bileşen, yetkili kullanıcıların mevcut kampanyaları düzenlemesini sağlar.
 */

import React, { useState, useEffect } from 'react';
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
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import trLocale from 'date-fns/locale/tr';

// CSS Stilleri
const styles = `
.campaign-edit-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.campaign-edit-card {
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 24px !important;
  background-color: white !important;
  transition: all 0.3s ease !important;
}

.campaign-edit-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
  padding: 16px !important;
  border-bottom: 1px solid #e0e0e0;
}

.campaign-edit-title {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #333 !important;
  margin-bottom: 8px !important;
}

.campaign-edit-subtitle {
  color: #666 !important;
  font-size: 1rem !important;
}

.campaign-edit-form {
  padding: 24px !important;
}

.campaign-edit-button {
  background-color: #1976d2 !important;
  color: white !important;
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-size: 1rem !important;
  transition: all 0.2s ease !important;
}

.campaign-edit-button:hover {
  background-color: #1565c0 !important;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3) !important;
}

.campaign-chip {
  margin-right: 8px !important;
  margin-bottom: 8px !important;
  background-color: #e3f2fd !important;
  color: #0d47a1 !important;
  font-weight: 500 !important;
}

.campaign-preview {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 16px;
}

@media (max-width: 600px) {
  .campaign-edit-form {
    padding: 16px !important;
  }
}
`;

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

// Demo kampanya verileri
const demoCampaign = {
  id: 1,
  title: "Yaz Sezonu Erken Rezervasyon",
  description: "Yaz tatili için erken rezervasyon yapanlara özel %25 indirim fırsatı!",
  discountRate: 25,
  discountType: "percent",
  startDate: new Date("2024-05-01"),
  endDate: new Date("2024-06-30"),
  targetHotels: ["Royal Hotel", "Palm Resort", "Blue Paradise"],
  isActive: true
};

const CampaignEditComponent = ({ campaignId, onSave, onCancel }) => {
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Gerçek uygulamada bu veri API'den alınacak
  useEffect(() => {
    // API çağrısını simüle etmek için setTimeout kullanıyoruz
    const timer = setTimeout(() => {
      setCampaign(demoCampaign);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [campaignId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCampaign({ ...campaign, [name]: value });
  };

  const handleToggleActive = (e) => {
    setCampaign({ ...campaign, isActive: e.target.checked });
  };

  const handleDateChange = (fieldName, newDate) => {
    setCampaign({ ...campaign, [fieldName]: newDate });
  };

  const handleHotelSelect = (e) => {
    const { value } = e.target;
    setCampaign({ ...campaign, targetHotels: value });
  };

  const handleSave = () => {
    // Form validasyonu
    if (!campaign.title || !campaign.description || campaign.targetHotels.length === 0) {
      setSnackbar({
        open: true,
        message: 'Lütfen tüm zorunlu alanları doldurun',
        severity: 'error'
      });
      return;
    }

    // Gerçek uygulamada burada API çağrısı yapılacak
    setSnackbar({
      open: true,
      message: 'Kampanya başarıyla güncellendi',
      severity: 'success'
    });

    // Başarılı yanıt durumunda callback'i çağırın
    if (onSave) {
      onSave(campaign);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!campaign) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h6" color="error">
          Kampanya bulunamadı veya yüklenirken bir hata oluştu.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="campaign-edit-container">
      <style>{styles}</style>
      
      <Card className="campaign-edit-card">
        <Box className="campaign-edit-header">
          <Typography variant="h5" className="campaign-edit-title">
            Kampanya Düzenle
          </Typography>
          <Typography variant="body1" className="campaign-edit-subtitle">
            Mevcut kampanya detaylarını güncelleyin
          </Typography>
        </Box>
        
        <CardContent className="campaign-edit-form">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kampanya Başlığı"
                name="title"
                value={campaign.title}
                onChange={handleInputChange}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kampanya Açıklaması"
                name="description"
                value={campaign.description}
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
                value={campaign.discountRate}
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
                  value={campaign.discountType}
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
                  value={campaign.startDate}
                  onChange={(newDate) => handleDateChange('startDate', newDate)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={trLocale}>
                <DatePicker
                  label="Bitiş Tarihi"
                  value={campaign.endDate}
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
                  value={campaign.targetHotels}
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
              <FormControlLabel
                control={
                  <Switch 
                    checked={campaign.isActive} 
                    onChange={handleToggleActive}
                    color="primary"
                  />
                }
                label="Kampanyayı aktif olarak yayınla"
              />
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Paper className="campaign-preview" elevation={0}>
            <Typography variant="subtitle1" gutterBottom>
              Kampanya Önizleme
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {campaign.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 1 }}>
                <Chip 
                  label={`%${campaign.discountRate} İndirim`}
                  size="small"
                  className="campaign-chip"
                  sx={{ mr: 1 }}
                />
                
                <Chip 
                  label={`${campaign.startDate?.toLocaleDateString('tr-TR')} - ${campaign.endDate?.toLocaleDateString('tr-TR')}`}
                  size="small"
                  className="campaign-chip"
                  icon={<CalendarIcon sx={{ fontSize: '1rem' }} />}
                />
                
                <Chip 
                  label={campaign.isActive ? 'Aktif' : 'Pasif'}
                  size="small"
                  sx={{ 
                    backgroundColor: campaign.isActive ? '#4caf50' : '#9e9e9e',
                    color: 'white',
                    ml: 1
                  }}
                />
              </Box>
              
              <Typography variant="body2" paragraph>
                {campaign.description}
              </Typography>
              
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption">
                  Hedef Oteller:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 0.5 }}>
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
            </Box>
          </Paper>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
            >
              İptal
            </Button>
            <Button
              variant="contained"
              className="campaign-edit-button"
              onClick={handleSave}
              startIcon={<SaveIcon />}
            >
              Kaydet
            </Button>
          </Box>
        </CardContent>
      </Card>
      
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

// Bileşeni nasıl kullanacağınızı gösteren örnek uygulama
const CampaignEditDemo = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleOpenEditor = () => {
    setIsEditing(true);
  };
  
  const handleSave = (updatedCampaign) => {
    console.log('Güncellenmiş kampanya:', updatedCampaign);
    // Gerçek uygulamada burada kampanya güncellemesi yapılabilir
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  if (isEditing) {
    return <CampaignEditComponent 
      campaignId={1} 
      onSave={handleSave} 
      onCancel={handleCancel} 
    />;
  }
  
  return (
    <Box sx={{ textAlign: 'center', p: 5 }}>
      <Typography variant="h5" gutterBottom>
        Kampanya Düzenleme Demosu
      </Typography>
      <Button
        variant="contained"
        startIcon={<EditIcon />}
        onClick={handleOpenEditor}
        sx={{ mt: 2 }}
      >
        Kampanyayı Düzenle
      </Button>
    </Box>
  );
};

export { CampaignEditComponent, CampaignEditDemo };
export default CampaignEditComponent; 