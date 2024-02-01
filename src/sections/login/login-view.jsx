import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { bgGradient } from 'src/theme/css';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [validateError, setValidateError] = useState('')

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token')
    const validateToken = async () => {
      try {
        const response = await axios.post('http://localhost:3002/tokenverify', null, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })

        if (response.status === 200) {
          navigate('/')
        } else {
          localStorage.removeItem('name')
          localStorage.removeItem('email')
          localStorage.removeItem('token')
        }
      } catch (error) {
        localStorage.removeItem('name')
        localStorage.removeItem('email')
        localStorage.removeItem('token')
      }
    }
    validateToken()
  }, [navigate])

  const validateEmail = () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    setEmailError(!isValid);
    return isValid;
  };

  const validatePassword = () => {
    const isValid = password.length >= 6;
    setPasswordError(!isValid);
    return isValid;
  };

  const handleClick = async () => {
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      setLoading(true)
      try {
        // Make a POST request using Axios
        const response = await axios.post(
          'http://localhost:3002/login/admin',
          {
            panelEmail: email,
            panelPassword: password,
          }
        );

        setValidateError('')

        localStorage.setItem('token', response.data.token)
        localStorage.setItem('name', response.data.panel.panelName)
        localStorage.setItem('email', response.data.panel.panelEmail)

        const loginToken = await localStorage.getItem('token')
        const loginName = await localStorage.getItem('name')
        const loginEmail = await localStorage.getItem('email')

        setLoading(false)
        if (loginToken && loginName && loginEmail) {
          navigate('/user');
        }
      } catch (error) {
        if (error.code === "ERR_NETWORK") {
          setValidateError('Network error, please try again later.')
          setEmail('')
          setPassword('')
          setLoading(false)
          return;
        }
        setValidateError(error.response.data.message)
        setLoading(false)
      }
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          helperText={emailError ? 'Please enter a valid email' : ''}
        />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
          helperText={passwordError ? 'Password must be at least 6 characters' : ''}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} color={showPassword ? 'magenta' : ''} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack sx={{ margin: '20px 0', color: 'red' }}>
        {validateError}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
        loading={loading}
      >
        Login
      </LoadingButton>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" sx={{ marginBottom: 5 }}>Sign in to Admin Panel</Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}