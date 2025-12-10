import { useForm } from 'react-hook-form';
import React, { lazy, useState, Suspense } from 'react';

import { Box, Grid, Typography, useMediaQuery } from '@mui/material';

import useApplyLoanStore from 'src/store/loan-store/LoanStore';
import StepperContainer from 'src/modules/loans/personal-loan/sections/StepperContainer';
import { LoadingScreen } from 'src/components/mui-components/loading-screen';

const LoanDetailsView = lazy(
  () => import('src/modules/loans/personal-loan/sections/tabs/LoanDetailsView')
);
const PersonalInfoView = lazy(
  () => import('src/modules/loans/personal-loan/sections/tabs/PersonalDetailsView')
);
const LoanDocumentView = lazy(
  () => import('src/modules/loans/personal-loan/sections/tabs/LoanDocumentView')
);
const EmploymentDetailsView = lazy(
  () => import('src/modules/loans/personal-loan/sections/tabs/EmploymentDetailsView')
);

function LoanPreview() {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const {
    personalInfo,
    employmentInfo,
    loanInfo,
    documentUpload,
    myApplications,
    setMyApplications,
    handleBack,
    setIsApplicationSubmitted,
  } = useApplyLoanStore((state) => state);

  const [errorMsg, setErrorMsg] = useState('');

  const methods = useForm();
  const {
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (personalInfo && loanInfo && documentUpload && employmentInfo) {
      try {
        setMyApplications({
          id: +myApplications.length + 1,
          title: loanInfo?.loanType,
          description: loanInfo?.loanAmount,
          personalInfo,
          loanInfo,
          employmentInfo,
          documentUpload,
        });

        setIsApplicationSubmitted(true);
      } catch (error) {
        reset();
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {errorMsg}
      <Suspense fallback={<LoadingScreen size={24} />}>
        <Box mb={3}>
          <PersonalInfoView readOnly={true} />
        </Box>

        <Box mb={3}>
          <EmploymentDetailsView readOnly={true} />
        </Box>

        <Box mb={3}>
          <LoanDetailsView readOnly={true} />
        </Box>

        <Box>
          <LoanDocumentView readOnly={true} />
        </Box>
      </Suspense>
      <Grid container spacing={1.5} mt={1} sx={{ paddingRight: isMobile ? '10px' : '20px' }}>
        <StepperContainer loading={isSubmitting} handleBack={handleBack} activeStep={5} />
      </Grid>
    </form>
  );
}

export default LoanPreview;
