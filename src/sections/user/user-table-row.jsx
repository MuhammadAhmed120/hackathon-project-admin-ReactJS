import axios from 'axios';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Box, Modal, Button } from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: "90%",
  width: 400,
  bgcolor: '#fafafa',
  border: 'none',
  borderRadius: 1,
  boxShadow: 24,
  p: 3,
};

export default function UserTableRow({
  uid,
  status,
  avatarUrl,
  name,
  company,
  role,
  isVerified,
  selected,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false)
  };

  const handleOpenModal = () => {
    setModalOpen(true)
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const headers = {
          'Authorization': `Bearer ${token}`
        }

        const deleteUser = await axios.post('http://localhost:3002/user/user-delete', uid, { headers })

        console.log(deleteUser)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <TableRow hover tabIndex={-1} selected={selected}>

        <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>{status}</Label>
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{company}</TableCell>

        <TableCell>{role}</TableCell>

        <TableCell align="center">{isVerified}</TableCell>


        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
      >
        <Box sx={style}>
          <div className='flex flex-col gap-10'>
            <h1 className='text-lg sm:text-xl text-red-500'>
              Do you want to delete?
            </h1>
            <div className='flex gap-2 self-end'>
              <Button variant='outlined' onClick={handleCloseModal}>Cancel</Button>
              <LoadingButton color='error' variant='contained' loading={loading} onClick={handleDelete}>Delete</LoadingButton>
            </div>
          </div>
        </Box>
      </Modal>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleOpenModal} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  uid: PropTypes.any,
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
