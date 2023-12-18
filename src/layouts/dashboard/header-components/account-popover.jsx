import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { account } from 'src/_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const token = localStorage.getItem('token')

  const handleClose = () => {
    setOpen(null);
    localStorage.removeItem('token')
    localStorage.removeItem('name')
  };

  const [adminData, setAdminData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const response = await axios.get('http://localhost:3002/user/admin-account', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setAdminData(response.data.panelData);
          localStorage.setItem('name', response.data.panelData.panelName)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });


  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          {!token ? <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            <NavLink to='/login'>
              Login
            </NavLink>
          </Typography> :
            <>
              <Typography variant="subtitle2" noWrap>
                {adminData && adminData.panelName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {adminData && adminData.panelEmail}
              </Typography>
            </>}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        {token && <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleClose}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>}
      </Popover>
    </>
  );
}
