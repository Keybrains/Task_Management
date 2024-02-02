// project import
// import NavCard from './NavCard';
import Navigation from './Navigation/UserNavigation';
import SimpleBar from 'user/components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const UserDrawerContent = () => (
  <SimpleBar
    sx={{
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column'
      }
    }}
  >
    <Navigation />
    {/* <NavCard /> */}
  </SimpleBar>
);

export default UserDrawerContent;
