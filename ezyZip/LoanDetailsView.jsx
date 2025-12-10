import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from '@components/mui-components/hook-form';

import {
  Grid,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
  Card,
  Typography,
  FormHelperText,
} from '@mui/material';

import useApplyLoanStore from 'src/store/loan-store/LoanStore';
import StepperContainer from 'src/modules/loans/personal-loan/sections/StepperContainer';

export default function LoanDetailsView({ readOnly = false, handleNextOrSubmit }) {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { loanInfo, setLoanInfo, handleNext, handleBack } = useApplyLoanStore((state) => state);
  const [errorMsg, setErrorMsg] = useState('');
  const defaultValues = {
    loanType: loanInfo?.loanType ?? '',
    loanPurpose: loanInfo?.loanPurpose ?? '',
    loanAmount: loanInfo?.loanAmount ?? '',
    tenure: loanInfo?.tenure ?? '',
    roi: '10.25',
    emiCalculated: loanInfo?.emiCalculated ?? '',
  };
  const qualificationSchema = Yup.object().shape({
    loanAmount: Yup.string()
      .required('Loan amount is required')
      .test(
        'maximum',
        'Loan amount must be lesser than or equal to 50,00,000/-',
        (val) => +val <= 5000000
      ),
    tenure: Yup.string().required('Loan tenure is required'),
    loanPurpose: Yup.string().required('Loan purpose is required'),
  });
  
  const methods = useForm({
    resolver: yupResolver(qualificationSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    register,
  } = methods;
  const loanAmountWatch = watch('loanAmount');
  const tenureWatch = watch('tenure');
  function calculateEMI(principal, annualRate, tenureYears) {
    const monthlyInterestRate = annualRate / 12 / 100;
    const totalPayments = tenureYears * 12;
    const emi =
      (principal * monthlyInterestRate * (1 + monthlyInterestRate) ** totalPayments) /
      ((1 + monthlyInterestRate) ** totalPayments - 1);
    return emi.toFixed(2);
  }
  useEffect(() => {
    setValue('roi', 10.25);
    setValue('emiCalculated', calculateEMI(+loanAmountWatch, 10.25, +tenureWatch));
  }, [setValue, loanAmountWatch, tenureWatch, watch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoanInfo(data);
      handleNext();
      handleNextOrSubmit(data);
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const isPersonalLoan = loanInfo?.loanType === 'personal-loan';
  const loanTenureCount = isPersonalLoan ? 30 : 6;
  const loanTenuareArray = Array.from({ length: loanTenureCount }, (_, index) => index + 1);
  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <FormControl fullWidth>
        <Card elevation={4} sx={{ p: '12px 0px 12px 12px', mr: '6px', ml: '-6px' }}>
          <Grid container gap={2}>
            <Grid item xs={12} display={'flex'} alignItems={'center'}>
              <Typography variant="body2" mr={1} fontWeight={'bold'}>
                Loan Details
              </Typography>
              <Typography variant="caption">(Maximum 50,00,00,000/-)</Typography>
            </Grid>
            <Grid item xs={12} sm={5.85} md={5.85}>
              <RHFTextField
                size="small"
                name="loanAmount"
                label="Loan Amount"
                disabled={readOnly}
                type="number"
              
              />
            </Grid>
            <Grid item xs={12} sm={5.85} md={5.9}>
  <FormControl fullWidth size="small" error={!!methods.formState.errors.tenure}>
    <InputLabel id="tenure">Loan Tenure</InputLabel>
    <Select
      fullWidth
      labelId="tenure"
      name="tenure"
      defaultValue={loanInfo?.tenure ?? ''}
      disabled={readOnly}
      {...register('tenure')}
    >
      <MenuItem value="">
        <em>Loan Tenure</em>
      </MenuItem>
      {loanTenuareArray.map((_, i) => (
        <MenuItem key={i} value={i + 1}>
          {i + 1} year{i === 0 ? '' : 's'}
        </MenuItem>
      ))}
    </Select>
    <FormHelperText>{methods.formState.errors.tenure?.message}</FormHelperText>
  </FormControl>
</Grid>

<Grid item xs={12} sm={5.85} md={5.85}>
  <FormControl fullWidth size="small" error={!!methods.formState.errors.loanPurpose}>
    <InputLabel id="loanPurpose">Loan Purpose</InputLabel>
    <Select
      fullWidth
      labelId="loanPurpose"
      name="loanPurpose"
      defaultValue={loanInfo?.loanPurpose ?? ''}
      disabled={readOnly}
      {...register('loanPurpose')}
    >
      <MenuItem value="">
        <em>Loan Purpose</em>
      </MenuItem>
      <MenuItem value="wedding">Wedding</MenuItem>
      <MenuItem value="tour">Tour</MenuItem>
      <MenuItem value="medical">Medical</MenuItem>
      <MenuItem value="home-renovation">Home Renovation</MenuItem>
      <MenuItem value="others">Others</MenuItem>
    </Select>
    <FormHelperText>{methods.formState.errors.loanPurpose?.message}</FormHelperText>
  </FormControl>
</Grid>

          </Grid>
          {readOnly === false && (
            <Grid container>
              <StepperContainer loading={isSubmitting} handleBack={handleBack} />
            </Grid>
          )}
        </Card>
      </FormControl>
    </FormProvider>
  );

  return (
    <>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Typography variant="h6" gutterBottom>
        Loan Information
      </Typography>
      {renderForm}
    </>
  );
}

LoanDetailsView.propTypes = {
  readOnly: PropTypes.bool,
  handleNext: PropTypes.object,
  handleBack: PropTypes.object,
  handleNextOrSubmit: PropTypes.func,
};
