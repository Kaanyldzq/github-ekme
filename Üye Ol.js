/*
 * Üye Ol (Kaan Yıldız)
 * 
 * React ve Material-UI ile geliştirilmiş kullanıcı kayıt formu bileşeni.
 * Bu bileşen, kullanıcıların kayıt olmasını sağlar.
 */

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  IconButton,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  PersonAdd,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

// Dahili CSS Stilleri
const styles = `
/* Giriş ve Üye Ol sayfaları için stil tanımlamaları */

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 1rem;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  border-radius: 16px !important;
  overflow: hidden !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  background-color: white !important;
  transition: all 0.3s ease !important;
}

.auth-card:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15) !important;
}

.auth-header {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  color: white;
  padding: 2.5rem 2rem 2rem 2rem !important;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-radius: 16px 16px 0 0 !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.auth-header::before {
  content: '';
  position: absolute;
  top: -80px;
  left: -80px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.auth-header::after {
  content: '';
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
}

.auth-title {
  font-size: 2.5rem !important;
  font-weight: 700 !important;
  margin-top: 0.75rem !important;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  font-size: 1.5rem !important;
  opacity: 0.9;
  margin-top: 0.5rem !important;
  position: relative;
  z-index: 1;
  font-weight: 400 !important;
  color: rgba(255, 255, 255, 0.9);
}

.auth-form {
  padding: 2rem !important;
}

.auth-input {
  margin-bottom: 1.25rem !important;
}

.auth-input .MuiOutlinedInput-root {
  border-radius: 8px !important;
}

.auth-button {
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
  padding: 0.75rem 0 !important;
  border-radius: 8px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 1rem !important;
  background-color: #1976d2 !important;
  transition: all 0.3s ease !important;
}

.auth-button:hover {
  background-color: #1565c0 !important;
  box-shadow: 0 6px 15px rgba(25, 118, 210, 0.3) !important;
}

.auth-link {
  text-align: center !important;
  display: block !important;
  color: #1976d2 !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
}

.auth-link:hover {
  color: #1565c0 !important;
  text-decoration: underline !important;
}

.auth-divider {
  display: flex !important;
  align-items: center !important;
  margin: 1.5rem 0 !important;
  color: #666 !important;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.auth-divider::before {
  margin-right: 0.5rem;
}

.auth-divider::after {
  margin-left: 0.5rem;
}

.social-buttons {
  display: flex !important;
  justify-content: center !important;
  gap: 1rem !important;
  margin-bottom: 1rem !important;
}

.social-button {
  min-width: 0 !important;
  padding: 0.75rem !important;
  border-radius: 8px !important;
}

.google-button {
  background-color: #fff !important;
  color: #757575 !important;
  border: 1px solid #e0e0e0 !important;
}

.facebook-button {
  background-color: #3b5998 !important;
  color: white !important;
}

.auth-error {
  margin-bottom: 1.5rem !important;
  border-radius: 8px !important;
}

/* Responsive düzenlemeler */
@media (max-width: 600px) {
  .auth-card {
    max-width: 100%;
  }
  
  .auth-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem !important;
  }
  
  .auth-form {
    padding: 1.5rem !important;
  }
  
  .auth-title {
    font-size: 1.5rem !important;
  }
}
`;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleAgreeTerms = (e) => {
    setAgreeTerms(e.target.checked);
  };

  const handleLogin = () => {
    // Burada giriş sayfasına yönlendirme yapılabilir
    console.log("Giriş sayfasına yönlendiriliyor...");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (!agreeTerms) {
      setError('Devam etmek için kullanım koşullarını kabul etmelisiniz');
      return;
    }

    try {
      // Burada gerçek API çağrısı yapılabilir
      // Mock bir kayıt işlemi simüle ediyoruz
      setTimeout(() => {
        setIsRegistered(true);
        setError('');
      }, 1000);
      
      // Gerçek bir API çağrısı şöyle olabilir:
      /*
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsRegistered(true);
      } else {
        setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
      */
    } catch (err) {
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };

  if (isRegistered) {
    return (
      <div className="auth-container">
        <style>{styles}</style>
        <Paper elevation={0} className="auth-card">
          <Box className="auth-header">
            <Typography component="h1" variant="h4" className="auth-title">
              Kayıt Başarılı!
            </Typography>
          </Box>
          <Box className="auth-form" style={{ textAlign: 'center' }}>
            <Typography variant="h6" style={{ marginBottom: '20px' }}>
              Kaydınız başarıyla tamamlandı.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              className="auth-button"
              onClick={handleLogin}
            >
              Giriş Yap
            </Button>
          </Box>
        </Paper>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <style>{styles}</style>
      <Paper elevation={0} className="auth-card">
        <Box className="auth-header">
          <Typography component="h1" variant="h4" className="auth-title">
            Üye Ol
          </Typography>
          <Typography component="h2" variant="h5" className="auth-subtitle">
            Tatilim'e Hoş Geldiniz
          </Typography>
        </Box>

        <Box className="auth-form">
          {error && (
            <Alert severity="error" className="auth-error">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              className="auth-input"
              required
              fullWidth
              id="username"
              label="Kullanıcı Adı"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              className="auth-input"
              required
              fullWidth
              id="email"
              label="E-posta Adresi"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              className="auth-input"
              required
              fullWidth
              name="password"
              label="Şifre"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              className="auth-input"
              required
              fullWidth
              name="confirmPassword"
              label="Şifre Tekrar"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={agreeTerms} 
                  onChange={handleAgreeTerms} 
                  color="primary" 
                />
              }
              label={
                <Typography variant="body2">
                  <span>Kullanım koşullarını ve </span>
                  <Link href="#" className="auth-link" style={{ display: 'inline' }}>
                    gizlilik politikasını
                  </Link>
                  <span> kabul ediyorum</span>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="auth-button"
              disabled={!agreeTerms}
            >
              Üye Ol
            </Button>
            
            <div className="auth-divider">veya</div>
            
            <Box className="social-buttons">
              <Button
                variant="contained"
                className="social-button google-button"
                startIcon={<GoogleIcon />}
              >
                Google ile Üye Ol
              </Button>
              <Button
                variant="contained"
                className="social-button facebook-button"
                startIcon={<FacebookIcon />}
              >
                Facebook ile Üye Ol
              </Button>
            </Box>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="#" onClick={handleLogin} variant="body2" className="auth-link">
                Zaten hesabınız var mı? Giriş yapın
              </Link>
            </Box>
          </form>
        </Box>
      </Paper>
    </div>
  );
};

// Kullanım örneği
const UyeOlDemo = () => {
  return <Register />;
};

export { Register, UyeOlDemo };
export default Register; 