import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';



// ----------------------------------------------------------------------

export default function AppView() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/user/all-users');
        setUserData(response.data.allUserData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Student Attendance:
      </Typography>

      <div style={{ backgroundColor: '#f0f0f0', padding: '1.5rem 0', borderRadius: 10 }}>
        <h1 style={{ margin: 0, marginBottom: 20, fontSize: 22, color: '#212b36', width: 'fit-content', marginLeft: 20 }}>Students</h1>

        <div style={{ overflow: 'auto', height: "500px", background: '#fff', padding: '0 1rem' }}>
          {userData && userData.reverse().map((user) => (
            <div key={user._id} style={{ marginTop: 25 }}>

              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar alt={user.userName} src={user.userProfileImage} />

                <Typography variant="h6" noWrap style={{ color: '#454d56' }}>
                  {user.userName}
                </Typography>
              </Stack>

              {user.attendance && user.attendance.length > 0 ? (
                <ul>
                  {user.attendance.reverse().map((attendance) => (
                    <span key={attendance._id}>
                      <li style={{ color: 'green' }}>
                        Check-in-Time: {attendance.checkInTime}
                      </li>
                      <div style={{ height: 1, width: '100%', background: 'gainsboro' }} />
                    </span>
                  ))}
                </ul>
              ) : (
                <ul>
                  <li style={{ color: 'red' }}>Not Checked In</li>
                  <div style={{ height: 1, width: '100%', background: 'gainsboro' }} />
                </ul>
              )}

            </div>
          ))}

        </div>

      </div>

    </Container>
  );
}
