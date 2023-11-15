import React, { useState } from 'react';
import { View, StyleSheet, Text, Button, Pressable, TouchableOpacity } from 'react-native';
import { Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

// import { isValidEmail, isValidObjField, updateError } from '../utils/methods';
import FormContainer from './FormContainer';
import FormInput from './FormInput.js';
import FormSubmitButton from './FormSubmitButton';
import { StackActions } from '@react-navigation/native';
import { API_URL_PROXY, GOOGLE_MAPS_API_KEY } from '@env'

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useLogin } from '../../contexts/LoginProvider';


// import client from '../api/client';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(3, 'Invalid name!')
    .required('Name is required!'),
  lastName: Yup.string()
    .trim()
    .min(3, 'Invalid name!')
    .required('Name is required!'),
  email: Yup.string().email('Invalid email!').required('Email is required!'),
  password: Yup.string()
    .trim()
    .min(8, 'Password is too short!')
    .required('Password is required!'),
  confirmPassword: Yup.string().equals(
    [Yup.ref('password'), null],
    'Password does not match!'
  ),
});

const SignupForm = ({ navigation }) => {
  const userInfo = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const [error, setError] = useState('');
  const { setIsLoggedIn, setUserData} = useLogin()

  const { firstName, lastName, email, password, confirmPassword } = userInfo;

  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

const isValidObjField = obj => {
    return Object.values(obj).every(value => value.trim());
  };
  
const updateError = (error, stateUpdater) => {
    stateUpdater(error);
    setTimeout(() => {
      stateUpdater('');
    }, 2500);
  };
  
const isValidEmail = value => {
    const regx = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return regx.test(value);
  };

  const isValidForm = (values) => {
    // we will accept only if all of the fields have value
    // if (!isValidObjField(userInfo))
    //   return updateError('Required all fields!', setError);
    // if valid name with 3 or more characters
    if (!values.firstName.trim() || values.firstName.length < 2)
      return updateError('Invalid name!', setError);
    if (!values.lastName.trim() || values.lastName.length < 2)
      return updateError('Invalid name!', setError);
    // // only valid email id is allowed
    if (!isValidEmail(values.email)) return updateError('Invalid email!', setError);
    // password must have 8 or more characters
    if (!values.password.trim() || values.password.length < 8)
      return updateError('Password is less then 8 characters!', setError);
    // password and confirm password must be the same
    if (values.password !== values.confirmPassword)
      return updateError('Password does not match!', setError);

    return true;
  };

  const sumbitForm = (values) => {
    console.log('values',values)
    console.log('called', userInfo)
    if (isValidForm(values)) {
      signUp(values)
    }
  };

  const signUp = async (values, formikActions) => {
    console.log('lastname',values.lastName)
    const response = await fetch(`${API_URL_PROXY}/api/users/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: values.email,confirmPassword: values.confirmPassword, password: values.password, firstName: values.firstName, lastName: values.lastName})
    })
    
    const json = await response.json()
    console.log('json',json)

    if(response.ok) {
        setIsLoggedIn(true)
        setUserData(json)
        await AsyncStorage.setItem('token', token)
        navigation.disptach(
            StackActions.replace('Posts')
        )
    }
    if(!response.ok) {

    }
    // if (res.data.success) {
    //   const signInRes = await client.post('/sign-in', {
    //     email: values.email,
    //     password: values.password,
    //   });
    //   if (signInRes.data.success) {
    //     navigation.dispatch(
    //       StackActions.replace('ImageUpload', {
    //         token: signInRes.data.token,
    //       })
    //     );
    //   }
    // }

    // formikActions.resetForm({});
    // formikActions.setSubmitting(false);
  };

  return (
    <FormContainer>
      <Formik
        initialValues={userInfo}
        validationSchema={validationSchema}
        onSubmit={signUp}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          const { firstName, lastName, email, password, confirmPassword } = values;
          return (
            <>
              <FormInput
                value={firstName}
                error={touched.firstName && errors.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                label='First Name'
                placeholder='John'
              />
              <FormInput
                value={lastName}
                error={touched.lastName && errors.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                label='Last Name'
                placeholder='Smith'
              />
              <FormInput
                value={email}
                error={touched.email && errors.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize='none'
                label='Email'
                placeholder='example@email.com'
              />
              <FormInput
                value={password}
                error={touched.password && errors.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                autoCapitalize='none'
                secureTextEntry
                label='Password'
                placeholder='********'
              />
              <FormInput
                value={confirmPassword}
                error={touched.confirmPassword && errors.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                autoCapitalize='none'
                secureTextEntry
                label='Confirm Password'
                placeholder='********'
              />
              <FormSubmitButton
                submitting={isSubmitting}
                onPress={() => sumbitForm(values)}
                title='Sign up'
              />
            </>
          );
        }}
      </Formik>
      <TouchableOpacity>
      <Pressable style={styles.button} onPress={() => navigation.navigate('LanscaperForm')}>
      <Text style={styles.text}>Are you a Landscaper?</Text>
    </Pressable>
    </TouchableOpacity>
    </FormContainer>
  );
};


const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'lightblue',
      top: 10,
      width: '70%',
      height: 50,
      alignSelf: 'center',
      alignContent: 'center',
      alignText: 'center',
      marginBottom: 40,
    },
    text: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
      alignSelf: 'center',
    },
  });
export default SignupForm;