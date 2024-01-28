import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const token = localStorage.getItem('token')

const navConfig = [
  {
    title: 'attendance',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'students',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: token ? 'logout' : 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;