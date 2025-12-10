import Iconify from '@components/mui-components/iconify/iconify';

import { GridCheckCircleIcon } from '@mui/x-data-grid';
import { Box, Grid, Card, Stack, Button, Typography, CardContent } from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { ModuleRoutes } from 'src/routes/ModuleRoutes';

import useApplyLoanStore from 'src/store/loan-store/LoanStore';
import { callPostLoanDataService } from 'src/modules/loans/personal-loan/PersonalLoanService';

export default function LoanFinalView() {
  const {
    personalInfo,
    employmentInfo,
    loanInfo,
    documentUpload,
    // myApplications,
    resetEverything,
  } = useApplyLoanStore((state) => state);
  const router = useRouter();

  const handleHomeClick = async () => {
    const loanApplicationData = {
      personalInfo,
      employmentInfo,
      loanInfo,
      documentUpload,
      // myApplications,
    };

    try {
      const response = await callPostLoanDataService(loanApplicationData);
      router.push(ModuleRoutes.shared.dashboard);
      resetEverything();
    } catch (error) {
      console.error('❌ Error submitting loan details:', error);
    }
  };
  const handleCopyClick = () => {
    const applicationNumber = '1234-12334-2344';
    navigator.clipboard.writeText(applicationNumber).then(() => {});
  };

  const handleDownloadClick = () => {};

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={1} px={2}>
      <GridCheckCircleIcon color="success" sx={{ fontSize: { xs: 40, md: 50 } }} />
      <Typography variant="h4" sx={{ mt: 4, textAlign: 'center' }}>
        Hi{' '}
        {personalInfo.firstName.charAt(0).toUpperCase() +
          personalInfo.firstName.slice(1).toLowerCase()}
        , we received your loan application. We will contact you soon for the update.
      </Typography>

      <Typography variant="h4" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
        Thank you for trusting us!
        <span role="img" aria-label="smile" style={{ fontSize: '2.5rem' }}>
          😊
        </span>
      </Typography>
      <Card sx={{ mt: 2, p: 2, backgroundColor: '#e8f5e9', borderRadius: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Box display="flex" justifyContent="center">
                <Iconify icon="twemoji:shield" width={100} />
              </Box>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Box display="flex" alignItems="center">
                <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{ textDecoration: 'underline' }}
                >
                  Application Form Number
                </Typography>
              </Box>
              <Typography variant="h5" color="textSecondary" sx={{ mt: 1 }}>
                1234-12334-2344
                <Stack direction="row">
                  <Iconify
                    icon="material-symbols:content-copy-outline"
                    onClick={handleCopyClick}
                    sx={{ ml: 1, cursor: 'pointer' }}
                  />
                  <Iconify
                    icon="material-symbols:download-rounded"
                    onClick={handleDownloadClick}
                    sx={{ ml: 1, cursor: 'pointer' }}
                  />
                </Stack>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 4, width: { xs: '100%', sm: '200px' } }}
        onClick={handleHomeClick}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}
