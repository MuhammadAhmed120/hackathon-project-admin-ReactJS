import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';

// ----------------------------------------------------------------------

const RouterLink = forwardRef(({ href, ...other }, ref) => {
  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
  };

  return (
    <NavLink
      ref={ref}
      to={href}
      onClickCapture={(e) => {
        if (
          e.target.innerText === 'Logout'
        ) {
          handleLogout()
        }
      }}
      {...other}
    />
  );
});


RouterLink.propTypes = {
  href: PropTypes.string,
};

export default RouterLink;
