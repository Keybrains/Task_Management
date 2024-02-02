import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Stack } from '@mui/material';

// project import
import DrawerHeaderStyled from './UserDrawerHeaderStyled';
import Logo from 'assets/images/Your_paragraph_text__1_-removebg-preview.png';

// ==============================|| DRAWER HEADER ||============================== //

const UserDrawerHeader = ({ open }) => {
  const theme = useTheme();

  return (
    // only available in paid version
    <DrawerHeaderStyled theme={theme} open={open}>
      <Stack direction="row" spacing={1} alignItems="center">
        <img src={Logo} alt="Logo" height={100} width={190} />
      </Stack>
    </DrawerHeaderStyled>
  );
};

UserDrawerHeader.propTypes = {
  open: PropTypes.bool
};

export default UserDrawerHeader;
