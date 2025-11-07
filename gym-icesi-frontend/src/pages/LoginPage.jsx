import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Link
} from '@mui/material';
import loginImage from '../assets/saman.jpg';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Imagen izquierda (más ancha) */}
      <Grid
        item
        xs={13}
        md={7}
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={loginImage}
          alt="Campus Icesi"
          sx={{
            width: '120%',
            height: '100vh',
            objectFit: 'cover',
            filter: 'brightness(0.95)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            bgcolor: 'rgba(0,0,0,0.55)',
            color: 'white',
            textAlign: 'center',
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Llega más lejos
          </Typography>
          <Typography variant="body2">icesi.edu.co</Typography>
        </Box>
      </Grid>

      {/* Formulario derecho (más a la derecha) */}
      <Grid
        item
        xs={12}
        md={5}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          bgcolor: '#f9fafc',
          pl: { md: 20 }, 
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 4, md: 6 },
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
            bgcolor: 'white',
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
            mb={3}
            sx={{ color: '#1a237e' }}
          >
            Inicia sesión
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <TextField
              label="Correo institucional"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                py: 1.2,
                backgroundColor: '#3f51b5',
                fontWeight: 'bold',
                borderRadius: '8px',
                boxShadow: '0 3px 5px rgba(0,0,0,0.15)',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              Ingresar
            </Button>
          </Box>

          <Typography
            variant="body2"
            sx={{
              mt: 6,
              color: 'gray',
              fontSize: '0.8rem',
              lineHeight: 1.5,
            }}
          >
            Universidad Icesi, Calle 18 No. 122–135 <br />
            Cali-Colombia | Teléfono: 555 2334 | Fax: 555 1441 <br />
            Todos los derechos reservados © 2025
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
