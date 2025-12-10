import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from '@components/mui-components/hook-form';

import {
  Box,
  Card,
  Grid,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  Typography,
  FormControl,
  FormHelperText,
} from '@mui/material';

import Years from 'src/assets/data/dummy-data/Years.json';
import useApplyLoanStore from 'src/store/loan-store/LoanStore';
import StepperContainer from 'src/modules/loans/personal-loan/sections/StepperContainer';

export default function EmploymentDetailsView({ readOnly = false, handleNextOrSubmit }) {
  const { employmentInfo, setEmploymentInfo, occupation, handleNext } = useApplyLoanStore(
    (state) => state
  );
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    occupation,
    companyName: employmentInfo?.companyName ?? '',
    takeHomeSalary: employmentInfo?.takeHomeSalary ?? 0,
    netSalary: employmentInfo?.netSalary ?? 0,
    currentObligation: employmentInfo?.currentObligation ?? 0,
    degree: employmentInfo?.degree ?? '',
    designation: employmentInfo?.designation ?? '',
    withdrawalType: employmentInfo?.withdrawalType ?? '',
    currentExperience: employmentInfo?.currentExperience ?? '',
    totalExperience: employmentInfo?.totalExperience ?? '',
    pfStatus: employmentInfo?.pfStatus ?? '',
  };

  const qualificationSchema = Yup.object().shape({
    companyName: Yup.string().required('Company Name is required'),
    pfStatus: Yup.string().required('PF status is required'),
    companyAddress: Yup.string().required('Company Address is required'),
    officeEmail: Yup.string().email('Invalid email').required('Office Email is required'),
    takeHomeSalary: Yup.number().required('Take Home Salary is required'),
    currentObligation: Yup.number().required('Current Obligation is required'),
    degree: Yup.string().required('Degree is required'),
    designation: Yup.string().required('Designation is required'),
  });

  const methods = useForm({
    resolver: yupResolver(qualificationSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting,error},
    watch,
    setValue,
    register,
  } = methods;
  const takeHomeSalaryWatch = watch('takeHomeSalary');
  const currentObligationWatch = watch('currentObligation');

  useEffect(() => {
    const NET_SALARY = +takeHomeSalaryWatch - +currentObligationWatch;
    if (NET_SALARY < 0) {
      setErrorMsg('Net Salary cannot be greater than Take Home Salary');
    } else {
      setErrorMsg('');
      setValue('netSalary', NET_SALARY);
    }
  }, [setValue, takeHomeSalaryWatch, currentObligationWatch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setEmploymentInfo({ ...data, occupation });
      handleNext();
      handleNextOrSubmit(data);
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const isSelfEmployed = occupation === 'self-employed';

  return (
    <>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <Box display="flex" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Employment Details
        </Typography>
        <Typography variant="body2" gutterBottom sx={{ ml: 1 }}>
          (*as per salary slip)
        </Typography>
      </Box>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <FormControl fullWidth>
          <Card elevation={2} sx={{ p: '12px 0px 12px 12px', mr: '6px', ml: '-6px' }}>
            {/* Company Details */}
            <Typography variant="body2" fontWeight="bold" mb={2}>
              Company Details
            </Typography>
            <Grid container rowGap={2} columnGap={2} mb={3}>
              <Grid item xs={12} sm={5.85}>
                <RHFTextField
                  name="companyName"
                  label="Company Name"
                  placeholder="Company Name"
                  disabled={readOnly}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={5.85}>
                <RHFTextField
                  name="companyAddress"
                  label="Company Address"
                  placeholder="Company Address"
                  disabled={readOnly}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={5.85}>
                <RHFTextField
                  name="officeEmail"
                  label="Office Email"
                  placeholder="Office Email Address"
                  disabled={readOnly}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={5.85}>
                <RHFTextField
                  name="designation"
                  label="Designation"
                  placeholder="Designation"
                  disabled={readOnly}
                  size="small"
                />
              </Grid>
              {!isSelfEmployed && (
                <>
                  <Grid item xs={12} sm={5.85}>
                    <FormControl fullWidth size="small" error={!!methods.formState.errors.currentExperience}>
                      <InputLabel id="currentExperience">Current Experience</InputLabel>
                      <Select
                        labelId="currentExperience"
                        id="currentExperience"
                        label="Current Experience"
                        {...register('currentExperience')}
                        defaultValue={employmentInfo?.currentExperience ?? ''}
                        disabled={readOnly}
                      
                      >
                        <MenuItem value="">
                          <em>Current Company Experience</em>
                        </MenuItem>
                        {Years.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                         <FormHelperText>{methods.formState.errors.currentExperience?.message}</FormHelperText>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={5.85}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="totalExperience">Total Experience</InputLabel>
                      <Select
                        labelId="totalExperience"
                        id="totalExperience"
                        label="Total Experience"
                        {...register('totalExperience')}
                        defaultValue={employmentInfo?.totalExperience ?? ''}
                        disabled={readOnly}
                        
                      >
                        <MenuItem value="">
                          <em>Total Experience</em>
                        </MenuItem>
                        {Years.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item xs={12} sm={5.85}>
                <FormControl fullWidth size="small">
                  <InputLabel id="degree">Education Qualification</InputLabel>
                  <Select
                    labelId="degree"
                    id="degree"
                    label="Education Qualification"
                    {...register('degree')}
                    defaultValue={employmentInfo?.degree ?? ''}
                    disabled={readOnly}
                  
                  >
                    <MenuItem value="">
                      <em>Select a degree</em>
                    </MenuItem>
                    <MenuItem value="doctorate">Doctorate</MenuItem>
                    <MenuItem value="postgraduate">Post graduate</MenuItem>
                    <MenuItem value="graduate">Graduate</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Salary Details */}
            <Typography variant="body2" fontWeight="bold" mb={2}>
              Salary
            </Typography>
            <Grid container rowGap={2} columnGap={2}>
              <Grid item xs={12} sm={5.85}>
                <RHFTextField
                  name="takeHomeSalary"
                  type="number"
                  label="Take Home Salary"
                  disabled={readOnly}
                  size="small"
                  
                />
              </Grid>
              {!isSelfEmployed && (
                <>
                  <Grid item xs={12} sm={5.85}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="withdrawalType">Salary Withdrawal Type</InputLabel>
                      <Select
                        labelId="withdrawalType"
                        id="withdrawalType"
                        label="Salary Withdrawal Type"
                        {...register('withdrawalType')}
                        defaultValue={employmentInfo?.withdrawalType ?? ''}
                        disabled={readOnly}
                     
                      >
                        <MenuItem value="">
                          <em>Salary Withdrawal Type</em>
                        </MenuItem>
                        <MenuItem value="bank">In bank account</MenuItem>
                        <MenuItem value="cheque">By cheque</MenuItem>
                        <MenuItem value="cash">By cash</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={5.85}>
                    <RHFTextField
                      name="currentObligation"
                      label="Current Obligation"
                      type="number"
                      disabled={readOnly}
                     
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5.85}>
                    <RHFTextField
                      name="netSalary"
                      type="number"
                      placeholder="Net Salary"
                      disabled
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={5.85}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="pfStatus">Is PF Deducted</InputLabel>
                      <Select
                        labelId="pfStatus"
                        id="pfStatus"
                        label="Is PF Deducted"
                        {...register('pfStatus')}
                        defaultValue={employmentInfo?.pfStatus ?? ''}
                        disabled={readOnly}
                        
                      >
                        <MenuItem value="">
                          <em>Is PF Deducted?</em>
                        </MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </Select>
                      <FormHelperText>
                      {methods.formState.errors.pfStatus?.message}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>

            {!readOnly && (
              <Grid container justifyContent="flex-end">
                <StepperContainer loading={isSubmitting} />
              </Grid>
            )}
          </Card>
        </FormControl>
      </FormProvider>
    </>
  );
}

EmploymentDetailsView.propTypes = {
  readOnly: PropTypes.bool,
  handleNextOrSubmit: PropTypes.func,
};
