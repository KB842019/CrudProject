import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import FormProvider, { RHFTextField } from '@components/mui-components/hook-form';

import {
  Card,
  Grid,
  Alert,
  FormLabel,
  Typography,
  FormControl,
  useMediaQuery,
} from '@mui/material';

import useApplyLoanStore from 'src/store/loan-store/LoanStore';
import StepperContainer from 'src/modules/loans/personal-loan/sections/StepperContainer';

export default function PersonalDetailsView({ readOnly = false, handleNextOrSubmit }) {
  const { personalInfo, setPersonalInfo, handleNext } = useApplyLoanStore((state) => state);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [errorMsg, setErrorMsg] = useState('');

  const defaultValues = {
    firstName: personalInfo?.firstName ?? '',
    middleName: personalInfo?.middleName ?? '',
    lastName: personalInfo?.lastName ?? '',
    email: personalInfo?.email ?? '',
    contactNumber: personalInfo?.contactNumber ?? '',
    pan: personalInfo?.pan ?? '',
    aadhaarNumber: personalInfo?.aadhaarNumber ?? '',
    permanentAddress: personalInfo?.permanentAddress ?? '',
    paCity: personalInfo?.paCity ?? '',
    paState: personalInfo?.paState ?? '',
    paPinCode: personalInfo?.paPinCode ?? '',
    communicationAddress: personalInfo?.communicationAddress ?? '',
    caCity: personalInfo?.caCity ?? '',
    caState: personalInfo?.caState ?? '',
    caPinCode: personalInfo?.caPinCode ?? '',
  };

  const personalInfoSchema = Yup.object().shape({
    firstName: Yup.string()
      .required('First Name is required')
      .min(2, 'First Name must be at least 2 characters')
      .max(50, 'First Name must be no more than 50 characters')
      .matches(/^[A-Za-z]+$/, 'First Name must only contain letters, no spaces'),

    middleName: Yup.string()
      .notRequired() // Marks it as optional
      .matches(/^[A-Za-z\s]*$/, 'Middle Name must only contain letters and spaces') // Only letters and spaces
      .test(
        'length',
        'Middle Name must be at least 2 characters',
        (value) => !value || value.length >= 2
      ) // Length check, only if value is provided
      .test(
        'length-max',
        'Middle Name must be no more than 50 characters',
        (value) => !value || value.length <= 50
      ), // Max length check, only if value is provided
      

    lastName: Yup.string()
      .required('Last Name is required')
      .min(2, 'Last Name must be at least 2 characters')
      .max(50, 'Last Name must be no more than 50 characters')
      .matches(/^[A-Za-z]+$/, 'First Name must only contain letters, no spaces'),

    email: Yup.string()
      .required('Email is required')
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}(\.[a-zA-Z]{2,})?$/,
        'Invalid email format'
      ),

    contactNumber: Yup.string()
      .required('Mobile number is required')
      .min(10, 'Contact Number must be 10 digits')
      .max(10, 'Contact Number must be 10 digits')
      .matches(/^[6789]\d{9}$/, 'Invalid mobile number'),

    pan: Yup.string()
      .required('PAN number is required')
      .min(10, 'PAN number must contain 10 characters')
      .max(10, 'PAN number must contain 10 characters')
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Invalid PAN number'),

    aadhaarNumber: Yup.string()
      .required('Aadhaar number is required')
      .matches(/^\d{12}$/, 'Invalid Aadhaar number'),

      permanentAddress: Yup.string()
      .required('Permanent Address is required')
      .max(100, 'Address must be no more than 100 characters')
      .matches(/^[a-zA-Z0-9\s,.\-/#]+$/, 'Invalid characters in address (no @ allowed)'),

    
    communicationAddress: Yup.string()
      .required('Communication Address is required')
      .max(100, 'Address must be no more than 100 characters'),

    paCity: Yup.string().required('City is required'),
    paState: Yup.string().required('State is required'),

    paPinCode: Yup.string()
      .required('Pin Code is required')
      .matches(/^\d+$/, 'Pin Code must only contain numbers')
      .min(6, 'Pin Code must be 6 digits')
      .max(6, 'Pin Code must be 6 digits'),

    caCity: Yup.string().required('City is required'),
    caState: Yup.string().required('State is required'),

    caPinCode: Yup.string()
      .required('Pin Code is required')
      .matches(/^\d+$/, 'Pin Code must only contain numbers')
      .min(6, 'Pin Code must be 6 digits')
      .max(6, 'Pin Code must be 6 digits'),
  });

  const methods = useForm({
    resolver: yupResolver(personalInfoSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
    watch,
    setValue,
    // register,
  } = methods;
  const watchSameAddress = watch('sameAsPermanent', personalInfo?.sameAsPermanent ?? false);
  useEffect(() => {
    if (watchSameAddress) {
      setValue('communicationAddress', watch('permanentAddress'));
      setValue('caCity', watch('paCity'));
      setValue('caState', watch('paState'));
      setValue('caPinCode', watch('paPinCode'));
    }
  }, [setValue, watchSameAddress, watch]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setPersonalInfo(data);
      handleNext();
      handleNextOrSubmit(data);
    } catch (error) {
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const capitalizeFirstLetter = (value) => {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  return (
    <>
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>
      <Card elevation={4} sx={{ p: '12px 0px 12px 12px', mr: '6px', ml: '-6px' }}>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <FormControl fullWidth>
            {/* Personal Details */}
            <Grid container rowGap={0} columnGap={0} mb={2}>
              {/* Upload Image */}
              <Grid item xs={12} sm={2}>
                <FormLabel htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  <Grid
                    sx={{
                      width: 150,
                      height: 150,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      overflow: 'hidden',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                    }}
                  >
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Uploaded"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          padding: 10,
                        }}
                      />
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1',
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          style={{ width: '30px', height: '30px' }}
                        >
                          <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                        <span style={{ fontSize: 12, marginTop: 10 }}>Upload Picture</span>
                        <span style={{ fontSize: 10, marginTop: 5 }}>
                          Format supported: *.jpg, *.png
                        </span>
                      </Typography>
                    )}
                  </Grid>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </FormLabel>
              </Grid>

              {/* Personal Details */}
              <Grid item xs={12} sm={10} container rowGap={2} columnGap={2}>
                <Grid item xs={12} sm={3.85}>
                  <RHFTextField
                    name="firstName"
                    label="First Name"
                    size="small"
                    disabled={readOnly}
                    inputProps={{
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z]/g, '').toUpperCase();
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3.8}>
                  <RHFTextField
                    name="middleName"
                    label="Middle Name"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      onInput: (e) => {
                        e.target.value = capitalizeFirstLetter(
                          e.target.value.replace(/[^A-Za-z ]/g, '')
                        );
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={3.8}>
                  <RHFTextField
                    name="lastName"
                    label="Last Name"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      onInput: (e) => {
                        e.target.value = capitalizeFirstLetter(
                          e.target.value.replace(/[^A-Za-z ]/g, '')
                        );
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5.85}>
                  <RHFTextField
                    name="email"
                    label="Email Address"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      onInput: (e) => {
    e.target.value = e.target.value.toLowerCase();
  },
                  }}
                  />
                </Grid>
                <Grid item xs={12} sm={5.8}>
                  <RHFTextField
                    name="contactNumber"
                    label="Contact Number"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      maxLength: 10,
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5.85}>
                  <RHFTextField
                    name="pan"
                    label="Permanent Account Number (PAN)"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      maxLength: 10,
                      onInput: (e) => {
                        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5.8}>
                  <RHFTextField
                    name="aadhaarNumber"
                    label="Aadhaar Number"
                    disabled
                    size="small"
                    inputProps={{
                      maxLength: 12,
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Address */}
            <Grid container rowGap={2} columnGap={2}>
              {/* Permanent Address */}
              <Grid item xs={12} sm={5.9} container rowGap={2} columnGap={2}>
                <Typography variant="body2" fontWeight={'bold'}>
                  Permanent Address
                </Typography>
                <Grid item xs={11.9}>
                  <RHFTextField
                    name="permanentAddress"
                    label="Address"
                    multiline
                    rows={2}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={11.9}>
                  <RHFTextField
                    name="paCity"
                    label="City"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z]/g, '');
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={5.8}>
                  <RHFTextField
                    name="paState"
                    label="State"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z ]/g, '');
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={5.8}>
                  <RHFTextField
                    name="paPinCode"
                    label="Pin Code"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      maxLength: 6,
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      },
                    }}
                  />
                </Grid>
              </Grid>

              {/* Communication Address */}
              <Grid item xs={12} sm={5.85} container rowGap={2} columnGap={2}>
                <Typography variant="body2" fontWeight={'bold'}>
                  Communication Address
                </Typography>
                <Grid item xs={11.9}>
                  <RHFTextField
                    name="communicationAddress"
                    label="Address"
                    multiline
                    rows={2}
                    disabled={readOnly}
                  />
                </Grid>
                <Grid item xs={11.9}>
                  <RHFTextField
                    name="caCity"
                    label="City"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z ]/g, '');
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={5.8}>
                  <RHFTextField
                    name="caState"
                    label="State"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^A-Za-z ]/g, '');
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={5.8}>
                  <RHFTextField
                    name="caPinCode"
                    label="Pin Code"
                    disabled={readOnly}
                    size="small"
                    inputProps={{
                      maxLength: 6,
                      onInput: (e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            {!readOnly && <StepperContainer loading={isSubmitting} />}
          </FormControl>
        </FormProvider>
      </Card>
    </>
  );
}
PersonalDetailsView.propTypes = { readOnly: PropTypes.bool, handleNextOrSubmit: PropTypes.func };