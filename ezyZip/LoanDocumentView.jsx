import * as Yup from 'yup';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useTheme } from '@emotion/react';
import { yupResolver } from '@hookform/resolvers/yup';
import Iconify from '@components/mui-components/iconify';
import FormProvider from '@components/mui-components/hook-form';
import RHFFileUpload from '@components/mui-components/hook-form/rhf-uplaod-field';

import { GridCheckCircleIcon } from '@mui/x-data-grid';
import {
  Grid,
  Alert,
  FormControl,
  useMediaQuery,
  TextField,
  Card,
  Typography,
  Box,
} from '@mui/material';

import useApplyLoanStore from 'src/store/loan-store/LoanStore';
import StepperContainer from 'src/modules/loans/personal-loan/sections/StepperContainer';
import { StepEnum } from '../../PersonalLoanService';

export default function LoanDocumentView({ readOnly = false, handleNextOrSubmit }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { documentUpload, setDocuments, handleNext, handleBack, activeStep } = useApplyLoanStore(
    (state) => state
  );
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    panCard: documentUpload?.panCard ?? '',
    aadhaarCard: documentUpload?.aadhaarCard ?? '',
    salarySlip: documentUpload?.salarySlip ?? '',
    bankStatement: documentUpload?.bankStatement ?? '',
  };

  const FILE_MAX_SIZE = 2 * 1024 * 1024; 
// const FILE_MIN_SIZE = 100 * 1024; 
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

const documentSchema = Yup.object({
  panCard: Yup.mixed()
    .required('Pan Card is required')
    .test('fileSize', 'File size must be between 100KB and 2MB', (file) =>
      file ?  file.size <= FILE_MAX_SIZE : false
    )
    .test('fileFormat', 'Only .pdf, .jpg, .jpeg, .png formats are allowed', (file) =>
      file ? SUPPORTED_FORMATS.includes(file.type) : false
    ),
  aadhaarCard: Yup.mixed()
    .required('Aadhaar Card is required')
    .test('fileSize', 'File size must be between 100KB and 2MB', (file) =>
      file ?  file.size <= FILE_MAX_SIZE : false
    )
    .test('fileFormat', 'Only .pdf, .jpg, .jpeg, .png formats are allowed', (file) =>
      file ? SUPPORTED_FORMATS.includes(file.type) : false
    ),
  salarySlip: Yup.mixed()
    .required('Salary Slip is required')
    .test('fileSize', 'File size must be between 100KB and 2MB', (file) =>
      file ?  file.size <= FILE_MAX_SIZE : false
    )
    .test('fileFormat', 'Only .pdf, .jpg, .jpeg, .png formats are allowed', (file) =>
      file ? SUPPORTED_FORMATS.includes(file.type) : false
    ),
  bankStatement: Yup.mixed()
    .required('Bank Statement is required')
    .test('fileSize', 'File size must be between 100KB and 2MB', (file) =>
      file ? file.size >=  file.size <= FILE_MAX_SIZE : false
    )
    .test('fileFormat', 'Only .pdf, .jpg, .jpeg, .png formats are allowed', (file) =>
      file ? SUPPORTED_FORMATS.includes(file.type) : false
    ),
});


  const methods = useForm({
    resolver: yupResolver(documentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    if (!data.panCard || !data.aadhaarCard || !data.salarySlip || !data.bankStatement) {
      setErrorMsg('All document uploads are required to proceed.');
      return;
    }

    try {
      setDocuments(data);
      handleNext();
      handleNextOrSubmit(data);
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Card elevation={4} sx={{ padding: '12px 2px 12px 12px' }}>
      <Box display={'flex'} alignItems={'center'}>
        <Typography variant="body2" mr={1} fontWeight={'bold'} gutterBottom>
          Documents
        </Typography>
        <Typography variant="caption" gutterBottom>
          (Format .pdf, .png, .jpg, and size 100KB to 300KB)
        </Typography>
      </Box>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <FormControl fullWidth>
          <Grid container gap={1}>
            <Grid item spacing={2} xs={4.9} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} mb={2}>
                <span>
                  {methods.watch('panCard') ? (
                    <GridCheckCircleIcon color="success" sx={{ fontSize: 25 }} />
                  ) : (
                    <Iconify icon="eva:clock-fill" width={30} sx={{ color: 'red' }} />
                  )}
                </span>
                <TextField name="Pan Card" placeholder="Upload Pan Card" disabled fullWidth />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} mb={2}>
                <span>
                  {methods.watch('aadhaarCard') ? (
                    <GridCheckCircleIcon color="success" sx={{ fontSize: 25 }} />
                  ) : (
                    <Iconify icon="eva:clock-fill" width={30} sx={{ color: 'red' }} />
                  )}
                </span>
                <TextField name="Aadhar Card" placeholder="Aadhar Card" disabled fullWidth />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} mb={2}>
                <span>
                  {methods.watch('salarySlip') ? (
                    <GridCheckCircleIcon color="success" sx={{ fontSize: 25 }} />
                  ) : (
                    <Iconify icon="eva:clock-fill" width={30} sx={{ color: 'red' }} />
                  )}
                </span>
                <TextField
                  name="Latest salary slips (3 Months)"
                  placeholder="Latest salary slips (3 Months)"
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 1 }} mb={2}>
                <span>
                  {methods.watch('bankStatement') ? (
                    <GridCheckCircleIcon color="success" sx={{ fontSize: 25 }} />
                  ) : (
                    <Iconify icon="eva:clock-fill" width={30} sx={{ color: 'red' }} />
                  )}
                </span>
                <TextField
                  name="Bank Statement (6 Months)"
                  placeholder="Bank Statement (6 Months)"
                  disabled
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item spacing={2} xs={6.9} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Grid item xs={12} mb={2}>
                <RHFFileUpload
                  name="panCard"
                  showIcon={activeStep === StepEnum.LOAN_PREVIEW}
                  type="file"
                  multiple={false}
                  label="Drop files here or click to browse through your machine."
                  disabled={readOnly}
                />
              </Grid>
              <Grid item xs={12} mb={2}>
                <RHFFileUpload
                  name="aadhaarCard"
                  showIcon={activeStep === StepEnum.LOAN_PREVIEW}
                  type="file"
                  multiple={false}
                  label="Drop files here or click to browse through your machine."
                  disabled={readOnly}
                />
              </Grid>
              <Grid item xs={12} mb={2}>
                <RHFFileUpload
                  name="salarySlip"
                  showIcon={activeStep === StepEnum.LOAN_PREVIEW}
                  type="file"
                  multiple={false}
                  label="Drop files here or click to browse through your machine."
                  disabled={readOnly}
                />
              </Grid>
              <Grid item xs={12} mb={2}>
                <RHFFileUpload
                  name="bankStatement"
                  showIcon={activeStep === StepEnum.LOAN_PREVIEW}
                  type="file"
                  multiple={false}
                  label="Drop files here or click to browse through your machine."
                  disabled={readOnly}
                />
              </Grid>
            </Grid>
          </Grid>
          {readOnly === false && (
            <StepperContainer loading={isSubmitting} handleBack={handleBack} />
          )}
        </FormControl>
      </FormProvider>
    </Card>
  );

  return (
    <>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Typography variant="h6" gutterBottom>
        Upload Document
      </Typography>
      {renderForm}
    </>
  );
}

LoanDocumentView.propTypes = {
  readOnly: PropTypes.bool,
  handleNextOrSubmit: PropTypes.func,
};
