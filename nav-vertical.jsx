import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, Stack, Drawer } from '@mui/material';

import { usePathname } from 'src/routes/hooks';

import { useResponsive } from 'src/utils/hooks/use-responsive';

import { NAV } from 'src/components/page-layouts/config-layout';
import Scrollbar from 'src/components/mui-components/scrollbar';
import mingleloans from 'src/components/page-components/logo/mingleloans.svg';
import { useNavData } from 'src/components/page-components/navigations/config-navigation';
import { BrandPanel, ApplicantBrandPanel } from 'src/components/page-components/brand-panel';
import NavSectionVertical from 'src/components/mui-components/nav-section/vertical/nav-section-vertical';
import NavToggleButton from 'src/components/page-components/navigations/header-toolbar/nav-toggle-button'; // /brand-panel/ApplicantBrandPanel";
import { setEntityTypeByUser } from 'src/utils/helpers/entityTypeUtils';

import { useAuthContext } from 'src/middleware/auth/hooks';
import { EntityTypesEnum } from 'src/global/ValueTypes/EntityTypes';

export default function NavVertical({ openNav, onCloseNav }) {
  const { user } = useAuthContext();
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');
  const menuItems = useNavData();
  const entityType = setEntityTypeByUser(user);

  useEffect(() => {
    if (!openNav) {
      onCloseNav();
    }
  }, [pathname, openNav, onCloseNav]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <img
        alt=""
        src={mingleloans}
        style={{
          height: '90px',
          width: '200px',
          marginLeft: '40px',
          marginTop: '10px',
        }}
      />

      <NavSectionVertical
        data={menuItems}
        slotProps={{
          currentRole: entityType,
        }}
      />

      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  const renderBrandPanel = (
    <Box
      sx={{
        position: { xs: 'absolute', lg: 'static' },
        bottom: { xs: 0, lg: 'auto' },
        width: '100%',
        borderTop: { xs: '1px solid #ccc', lg: 'none' },
        backgroundColor: { xs: '#f9f9f9', lg: 'inherit' },
      }}
    >
      {user?.entityType === EntityTypesEnum.APPLICANT && <ApplicantBrandPanel />}
      {user?.entityType !== EntityTypesEnum.APPLICANT && <BrandPanel />}
    </Box>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      <NavToggleButton />

      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
            backgroundColor: '#DAEBFE',
          }}
        >
          {renderContent}
          {renderBrandPanel}
        </Stack>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.W_VERTICAL,
              position: 'relative',
            },
          }}
        >
          {renderContent}
          {renderBrandPanel}
        </Drawer>
      )}
    </Box>
  );
}

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};
