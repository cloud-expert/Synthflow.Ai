import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useGoogleLogin } from "@react-oauth/google";
import { login } from '../../action/authAction';
import GoogleBtn from '../../components/auth/GoogleBtn';
import { getGoogleUserToken } from '../../action/authAction';
import { LOGIN_SUCCESS } from '../../action/types';
import { toast } from 'react-toastify';
import { loadUser } from '../../action/authAction';

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      var res = await getGoogleUserToken(codeResponse);
      if (res.message === "User Logged in successfully") {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res,
        });
        dispatch(loadUser());
        toast.success("User logged in successfully");
        navigate("/dashboard");
      }
    //   const formData = new FormData();
    //   formData.append('email', loginDetails.user.email);
    //   formData.append('password', process.env.REACT_APP_GOOGLE_PASSWORD);
    //   await dispatch(login(formData, navigate));
    //   setSubmitting(false);
    //   setLoggedIn(true);
    //   setUser(loginDetails.user);
    },
  });

  return (
      <div className='flex flex-col w-full bg-gray-100 h-screen justify-center items-center'>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
            password: Yup.string().max(255).required('Password is required').min(6, "Password is too short - should be 4 chars minimum"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();
            formData.append('email', values.email);
            formData.append('password', values.password);
            await dispatch(login(formData, navigate));
            setSubmitting(false);
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit} className='h-full'>
                  <div className='w-[100%] h-[100%] flex justify-center items-center'>
                      <div className='w-[40%] 2xl:w-[80%] min-w-[400px] bg-white rounded-lg px-10 py-10 border shadow-md 2xl:border-none 2xl:shadow-none'>
                          <div className='flex justify-between items-center'>
                              <span className='text-[#009585] text-2xl font-bold'>Sign in</span>
                          </div>
                          
                          <div className='mt-8 flex flex-col items-start'>
                              <GoogleBtn onClick={() => googleLogin()}/>
                              <hr className='my-2 w-full' />
                              <span>Email Address</span>
                              <input id="email-login" type="email" placeholder='Enter your email' name="email" value={values.email} onBlur={handleBlur} onChange={handleChange} 
                              error={Boolean(touched.email && errors.email)} className='w-full mt-2 bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2' />
                              <div className='mt-1'>
                                  {touched.email && errors.email && (
                                      <span className='text-sm text-red-700'>
                                          {errors.email}
                                      </span>
                                  )}
                              </div>
                          </div>
                          <div className='mt-5 flex flex-col items-start'>
                              <span>Password</span>
                          </div>
                          <div className='relative mt-2'>
                              <input id="password-login" placeholder='Enter your password' type={showPassword ? 'text' : 'password'} name="password" value={values.password} onBlur={handleBlur} onChange={handleChange} error={Boolean(touched.password)} className='w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2' />
                              <div className='cursor-pointer absolute top-1/2 right-[5%] -translate-y-1/2' onClick={() => { setShowPassword(!showPassword) }}>{!showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}</div>
                          </div>
                          <div className='mt-2 flex flex-col items-start'>
                              {touched.password && errors.password && (
                                  <span className='text-sm text-red-700'>
                                      {errors.password}
                                  </span>
                              )}
                          </div>
                          <div className='flex justify-between items-center mt-5'>
                              <div className='cursor-pointer' onClick={() => { setChecked(!checked) }}>
                                  <input
                                      checked={checked}
                                      onChange={() => { setChecked(!checked) }}
                                      type='checkbox'
                                      className='mx-3'
                                  />
                                  <span>Keep me sign in</span>
                              </div>
                              <Link to="/auth/forgotpassword" className='cursor-pointer hover:underline'><span>Forgot Password?</span></Link>
                          </div>
                          <div className='w-full my-7'>
                              <button disabled={isSubmitting} className='w-full bg-[#009788] rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5' type='submit'>
                                  Get Started
                              </button>
                          </div>
                          <Link to="/auth/signup"><span className='text-[#009585]'>Don't have an account?</span></Link>
                      </div>
                  </div>
              </form>
          )
          }
        </Formik>
    </div>
  );
};

export default Signin;
