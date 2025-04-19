/*
 * Kampanya sil (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş kampanya silme bileşeni.
 * Bu bileşen, yetkili kullanıcıların mevcut kampanyaları silmesini sağlar.
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
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
  List,
  ListItem,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  LocalOffer as LocalOfferIcon
} from '@mui/icons-material';

// CSS Stilleri
const styles = `
.campaign-delete-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.campaign-delete-card {
  border-radius: 12px !important;
  overflow: hidden !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 24px !important;
  background-color: white !important;
  transition: all 0.3s ease !important;
}

.campaign-delete-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
}

.campaign-delete-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4eff9 100%);
  padding: 16px !important;
  border-bottom: 1px solid #e0e0e0;
}

.campaign-delete-title {
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  color: #333 !important;
  margin-bottom: 8px !important;
}

.campaign-delete-subtitle {
  color: #666 !important;
  font-size: 1rem !important;
}

.campaign-delete-content {
  padding: 24px !important;
}

.campaign-item {
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  position: relative;
  transition: all 0.2s ease;
}

.campaign-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.campaign-item .delete-button {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.campaign-item:hover .delete-button {
  opacity: 1;
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

.confirm-dialog-content {
  padding: 16px;
  text-align: center;
}

.confirm-dialog-icon {
  font-size: 4rem !important;
  color: #f44336 !important;
  margin-bottom: 16px !important;
}

.delete-button {
  background-color: #f44336 !important;
  color: white !important;
}

.delete-button:hover {
  background-color: #d32f2f !important;
}

.confirm-button {
  background-color: #f44336 !important;
  color: white !important;
}

.cancel-button {
  color: #666 !important;
}

@media (max-width: 600px) {
  .campaign-delete-content {
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
    isActive: true
  },
  {
    id: 3,
    title: "Hafta Sonu Kaçamağı",
    description: "Hafta sonu 2 kişi 1 gece konaklamalarda %15 indirim!",
    discountRate: 15,
    discountType: "percent",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-08-31"),
    targetHotels: ["Riverside Inn", "Ocean View Hotel", "Grand Plaza Hotel"],
    isActive: false
  }
];

// Kampanya Silme Bileşeni
const CampaignDeleteComponent = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    campaignId: null,
    campaignTitle: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Kampanyaları yükle (gerçek uygulamada API'den alınacak)
  useEffect(() => {
    // API çağrısını simüle ediyoruz
    const timer = setTimeout(() => {
      setCampaigns(demoCampaigns);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Kampanya durumunu belirle
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

  // Silme onayı dialog'unu aç
  const handleOpenConfirmDialog = (campaignId, campaignTitle) => {
    setConfirmDialog({
      open: true,
      campaignId,
      campaignTitle
    });
  };

  // Silme onayı dialog'unu kapat
  const handleCloseConfirmDialog = () => {
    setConfirmDialog({
      open: false,
      campaignId: null,
      campaignTitle: ''
    });
  };

  // Kampanyayı sil
  const handleDeleteCampaign = () => {
    const { campaignId } = confirmDialog;
    
    // Gerçek uygulamada API çağrısı yapılacak
    // API endpoint: DELETE /api/campaigns/:id
    
    // Silme işlemini simüle ediyoruz
    setCampaigns(campaigns.filter(campaign => campaign.id !== campaignId));
    
    setSnackbar({
      open: true,
      message: 'Kampanya başarıyla silindi',
      severity: 'success'
    });
    
    handleCloseConfirmDialog();
  };

  // Snackbar'ı kapat
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Yükleme durumunu göster
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="campaign-delete-container">
      <style>{styles}</style>
      
      <Card className="campaign-delete-card">
        <Box className="campaign-delete-header">
          <Typography variant="h5" className="campaign-delete-title">
            Kampanya Sil
          </Typography>
          <Typography variant="body1" className="campaign-delete-subtitle">
            Mevcut kampanyaları görüntüleyin ve silmek istediğiniz kampanyaları kaldırın
          </Typography>
        </Box>
        
        <CardContent className="campaign-delete-content">
          {campaigns.length > 0 ? (
            <List sx={{ p: 0 }}>
              {campaigns.map(campaign => {
                const status = getCampaignStatus(campaign);
                
                return (
                  <ListItem key={campaign.id} disablePadding sx={{ mb: 2 }}>
                    <Paper className="campaign-item" elevation={0} sx={{ width: '100%' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                              {campaign.title}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={status.text}
                                size="small"
                                style={{ backgroundColor: status.color, color: 'white' }}
                              />
                              
                              <IconButton 
                                size="small" 
                                color="error"
                                className="delete-button"
                                onClick={() => handleOpenConfirmDialog(campaign.id, campaign.title)}
                                aria-label="Kampanyayı sil"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            <Chip 
                              label={`%${campaign.discountRate} İndirim`}
                              size="small"
                              className="discount-chip"
                              icon={<LocalOfferIcon sx={{ fontSize: '1rem' }} />}
                            />
                            
                            <Chip 
                              label={`${new Date(campaign.startDate).toLocaleDateString('tr-TR')} - ${new Date(campaign.endDate).toLocaleDateString('tr-TR')}`}
                              size="small"
                              className="campaign-chip"
                              icon={<CalendarIcon sx={{ fontSize: '1rem' }} />}
                            />
                          </Box>
                          
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {campaign.description}
                          </Typography>
                          
                          <Box>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5, color: '#666' }}>
                              Hedef Oteller:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
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
                        </Grid>
                      </Grid>
                    </Paper>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LocalOfferIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Hiç kampanya bulunamadı
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Görüntülenecek veya silinecek kampanya yok
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Silme Onayı Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Kampanyayı Silmek İstediğinize Emin Misiniz?
        </DialogTitle>
        <DialogContent>
          <Box className="confirm-dialog-content">
            <WarningIcon className="confirm-dialog-icon" />
            <Typography variant="body1" id="alert-dialog-description">
              <strong>{confirmDialog.campaignTitle}</strong> kampanyasını silmek üzeresiniz. 
              Bu işlem geri alınamaz ve kampanya kalıcı olarak silinecektir.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCloseConfirmDialog} 
            className="cancel-button"
            startIcon={<CloseIcon />}
          >
            Vazgeç
          </Button>
          <Button 
            onClick={handleDeleteCampaign} 
            className="confirm-button"
            variant="contained"
            startIcon={<CheckIcon />}
            autoFocus
          >
            Evet, Sil
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

// Kampanya Silme Demo Uygulaması
const CampaignDeleteDemo = () => {
  return (
    <Box sx={{ my: 4 }}>
      <CampaignDeleteComponent />
    </Box>
  );
};

export { CampaignDeleteComponent, CampaignDeleteDemo };
export default CampaignDeleteComponent; 