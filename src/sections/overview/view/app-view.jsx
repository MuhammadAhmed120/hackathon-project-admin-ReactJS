import axios from 'axios';
import React, { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';


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


  const sortedUsers = userData.slice().sort((a, b) => {
    const userAttendanceA = a.attendance.length > 0 ? a.attendance[a.attendance.length - 1].checkInTime : '1970-01-01 00:00:00'
    const userAttendanceB = b.attendance.length > 0 ? b.attendance[b.attendance.length - 1].checkInTime : '1970-01-01 00:00:00'

    return new Date(userAttendanceB) - new Date(userAttendanceA)
  });

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Student Attendance:
      </Typography>

      <div style={{ backgroundColor: '#f4f6f8', padding: '1rem 0', borderRadius: 15, boxShadow: '0px 2px 10px #ededed' }}>

        <h1 style={{ margin: 0, fontSize: 17, color: '#74828f', marginLeft: 20, marginBottom: userData.length >= 1 ? 15 : 0, fontWeight: 500 }}>Students</h1>

        <div style={{ overflow: 'auto', background: '#fff', padding: '0 1rem', height: "80vh", display: userData.length >= 1 ? 'block' : 'none' }}>

          {sortedUsers && sortedUsers.map((user) => (
            <div key={user._id} style={{ marginTop: 25 }}>
              <Accordion style={{ background: '#f4f6f8', marginBottom: 20, transition: '0.3s', boxShadow: '0px 2px 1px gainsboro' }}>

                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={2} style={{ gap: '1rem' }}>
                    <Avatar alt={user.userName} src={user.userProfileImage} />

                    <Typography variant="h6" fontWeight='medium' display='flex' alignItems='flex-start' justifyContent='center' flexDirection='column' width='fit-content' flexWrap color='#454d56' style={{ margin: 0, marginRight: 25, fontSize: 15 }}>
                      <span style={{ fontWeight: 600 }}>
                        {user.userID || 'N/A'}
                      </span>

                      <span>
                        {user.userName || 'N/A'}
                      </span>
                    </Typography>
                  </Stack>
                  <p style={{ fontWeight: 'bold', marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>Total: {user.attendance.length}</p>
                </AccordionSummary>

                {/* {console.log(user.attendance.attend )} */}
                <AccordionDetails style={{ background: '#fafafa' }}>
                  {user?.attendance && user?.attendance?.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      {user.attendance.map((attendance, index) =>
                        attendance.attend ?
                          (<span key={attendance._id}>
                            <li style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9', flexWrap: 'wrap', width: '100%' }}>

                              <div style={{ display: 'flex', alignItems: 'center', width: "100%" }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#ffffff', marginRight: '15px' }}>
                                  <span>✔</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0', width: '100%' }}>
                                  <span style={{ marginRight: 25 }}>
                                    <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>Check-in Time:</p>
                                    <p style={{ margin: 0, color: '#666666' }}>{attendance.checkInTime}</p>
                                  </span>
                                  <span>
                                    <span style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>Location:</span>
                                    <span style={{ color: '#888888' }}> {attendance.checkInLocation}</span>
                                  </span>
                                </div>
                              </div>
                            </li>
                          </span>
                          ) :
                          (<span key={attendance._id}>
                            <li style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 20px', backgroundColor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#ffffff', marginRight: '15px' }}>
                                  <span>✘</span>
                                </div>
                                <div>
                                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>Not Checked In</p>
                                  <p style={{ margin: 0, color: '#666666' }}>Reason: {user.absenceReason || 'N/A'}</p>
                                </div>
                              </div>
                            </li>
                          </span>)
                      )}
                    </ul>
                  ) : (
                    <ul style={{ listStyle: 'none', padding: '0', margin: '0' }}>
                      <li style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 20px', backgroundColor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#ffffff', marginRight: '15px' }}>
                            <span>✘</span>
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>No Attendance Found</p>
                            <p style={{ margin: 0, color: '#666666' }}>Reason: {user.absenceReason || 'N/A'}</p>
                          </div>
                        </div>
                      </li>
                      {/* <li style={{ borderBottom: '1px solid #e0e0e0', padding: '15px 20px', backgroundColor: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', color: '#ffffff', marginRight: '15px' }}>
                            <span>✘</span>
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 'bold', fontSize: '16px' }}>Not Checked In</p>
                            <p style={{ margin: 0, color: '#666666' }}>Reason: {user.absenceReason || 'N/A'}</p>
                          </div>
                        </div>
                      </li> */}
                    </ul>
                  )}
                </AccordionDetails>

              </Accordion>


            </div>
          ))}

        </div>

      </div>

    </Container >
  );
}


// // Get the latest check-in time for each user
// const latestCheckInTimeA = a.attendance.length > 0 ? a.attendance[a.attendance.length - 1].checkInTime : '1970-01-01 00:00:00';
// const latestCheckInTimeB = b.attendance.length > 0 ? b.attendance[b.attendance.length - 1].checkInTime : '1970-01-01 00:00:00';

// // Sort based on the latest check-in time (from newest to oldest)
// return new Date(latestCheckInTimeB) - new Date(latestCheckInTimeA);
