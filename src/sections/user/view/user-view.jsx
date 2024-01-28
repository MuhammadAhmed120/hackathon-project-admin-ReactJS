import axios from 'axios';
import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';

// ----------------------------------------------------------------------

export default function UserPage() {
  const [selected, setSelected] = useState([]);

  const [userData, setUserData] = useState();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [userId, setUserId] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [imgError, setImgError] = useState();
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [userIdError, setUserIdError] = useState(false);
  const [numberError, setNumberError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [validateError, setValidateError] = useState('')

  const [showPassword, setShowPassword] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);


  const validateEmail = () => {
    const isValid = /\S+@\S+\.\S+/.test(email);
    setEmailError(!isValid);
    return isValid;
  };

  const validateName = () => {
    const isValid = username.trim().length > 0;
    setNameError(!isValid);
    return isValid;
  };

  const validateCourse = () => {
    const isValid = course.trim().length > 0;
    setCourseError(!isValid);
    return isValid;
  };

  const validateUserId = () => {
    const isValid = userId.trim().length > 0;
    setUserIdError(!isValid);
    return isValid;
  };

  const validateNumber = () => {
    const isValid = number.trim().length > 0;
    setNumberError(!isValid);
    return isValid;
  };

  const validatePassword = () => {
    const isValid = password.length >= 6;
    setPasswordError(!isValid);
    return isValid;
  };

  const handleRegister = async () => {
    const isEmailValid = validateEmail();
    const isNameValid = validateName();
    const isCourseValid = validateCourse();
    const isUserIdValid = validateUserId();
    const isNumberValid = validateNumber();
    const isPasswordValid = validatePassword();

    if (
      isEmailValid &&
      isPasswordValid &&
      isNameValid &&
      isCourseValid &&
      isUserIdValid &&
      isNumberValid
    ) {
      try {
        const headers = {
          'Content-Type': 'multipart/form-data'
        }

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('userEmail', email);
        formData.append('userName', username);
        formData.append('userPassword', password);
        formData.append('userCourse', course);
        formData.append('userID', userId);
        formData.append('userNumber', number);

        const response = await axios.post(
          'http://localhost:3002/register/user',
          formData,
          { headers }
        );

        console.log('Response:', response);
        setValidateError('')
        setLoading(true)

        if (response.status === 200) {
          setValidateError('User registered successfully.')
          setIsDrawerOpen(false)
          setValidateError('')
          setLoading(false)
          setFetchAgain(true)
        }
      } catch (error) {
        setValidateError(error.response.data.message)
        console.error('Error:', error);
      }
    }
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleFile = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImgError('File size exceeds 5MB. Please select a smaller file.');
      } else {
        setSelectedImage(URL.createObjectURL(file));
        setImageFile(file)
        setImgError('');
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/user/all-users');
        setUserData(response.data.allUserData)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
    fetchData()
  }, [fetchAgain]);


  return (
    <Container>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        PaperProps={{
          sx: {
            maxWidth: '100%',
            width: '350px',
            minWidth: '35%',

            backgroundColor: '#f7f7f7',
            boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          },
        }}
      >
        <div className='text-[#333]'>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #ddd', marginBottom: '20px', paddingBottom: '15px' }}>
            <h2 style={{ margin: '0', padding: '0', fontWeight: 'bold', fontSize: '24px', color: '#333' }}>Register a Student</h2>
            <IconButton onClick={() => setIsDrawerOpen(false)} size="small" style={{ padding: '8px' }}>
              <Iconify icon="bi:x-lg" style={{ fontSize: '24px', color: '#74828f' }} />
            </IconButton>
          </div>

          <Stack sx={{ width: '100%', margin: '15px auto' }} spacing={3}>

            {/* USER IMAGE UPLOAD */}
            <div>
              <div className='flex gap-4 items-end'>
                <img src={selectedImage || "https://toppng.com/uploads/preview/user-account-management-logo-user-icon-11562867145a56rus2zwu.png"} className='w-24 h-24 rounded-full object-cover' alt="user" />
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload File
                  <input
                    accept="image/*"
                    type="file"
                    onChange={handleFile}
                    hidden
                  />
                </Button>
              </div>
              <p className='text-sm text-red-500 mt-2'>{imgError && imgError}</p>
            </div>

            <TextField
              name="name"
              label="Student Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={nameError}
              helperText={nameError ? 'Please enter a valid name.' : ''}
            />

            <TextField
              name="email"
              label="Student Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailError ? 'Please enter a valid email.' : ''}
            />

            <TextField
              name="course"
              label="Student Course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              error={courseError}
              helperText={courseError ? 'Please enter a valid course.' : ''}
            />

            <TextField
              name="userId"
              label="Student ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              error={userIdError}
              helperText={userIdError ? 'Please enter a valid ID.' : ''}
            />

            <TextField
              name="number"
              label="Student Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              error={numberError}
              helperText={numberError ? 'Please enter a valid number.' : ''}
            />

            <TextField
              name="password"
              label="Student Password"
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

            <Stack sx={{ margin: '20px 0', color: 'red' }}>
              {validateError}
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              onClick={handleRegister}
              loading={loading}
              endIcon={<Iconify icon="bi:person-plus-fill" style={{ fontSize: '20px', marginLeft: '8px' }} />}
            >
              Register Student
            </LoadingButton>

          </Stack>

        </div>
      </Drawer>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Students</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)}>
          Add Student
        </Button>
      </Stack>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                headLabel={[
                  { id: 'roll', label: 'Roll No' },
                  { id: 'name', label: 'Name', align: 'center' },
                  { id: 'password', label: 'Password' },
                  { id: 'course', label: 'Course' },
                  { id: 'email', label: 'Email', align: 'center' },
                  { id: '' },
                ]}
              />
              {console.log(userData)}
              <TableBody>
                {userData && userData.slice().reverse().map((user) => (
                  <UserTableRow
                    key={user._id}
                    uid={user._id}
                    status={user.userID || 'n/a'}
                    avatarUrl={user.userProfileImage}
                    name={user.userName}
                    company={user.userPassword}
                    role={user.userCourse || 'None'}
                    isVerified={user.userEmail}
                    selected={selected.indexOf(user.name) !== -1}
                    handleClick={(event) => handleClick(event, user.userName)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>


      </Card>

    </Container>
  );
}
