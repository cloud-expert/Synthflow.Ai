import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className='w-screen h-screen 2xl:flex'>
            <img src="/images/login_bg.png" className='h-full 2xl:w-[60%] hidden 2xl:block' alt="login background" />
            <div className='w-[100%] 2xl:w-[40%] grow h-full justify-center items-center'>
                <Formik initialValues={{ email: '', password: '' }} validationSchema={Yup.object().shape({
                    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                    password: Yup.string().max(255).required('Password is required'),
                    confirmPassword: Yup.string()
                        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
                        .required('Confirm password is required')
                })}
                    onSubmit={async (values, { setSubmitting }) => {
                        const formData = new FormData();
                        formData.append('email', values.email);
                        formData.append('password', values.password);
                        await axios({
                            method: 'post',
                            url: `${process.env.REACT_APP_API_URL}/auth/forgot-password/`,
                            data: formData,
                            headers: { 'Content-Type': 'multipart/form-data' }
                        })
                            .then((res) => {
                                if (res.status === 200) {
                                    setSubmitting(false);
                                    navigate("/auth/signin");
                                    toast.success("Password changed successfully");
                                }
                            })
                            .catch((err) => {
                                toast.error(err.response.data.error)
                                setSubmitting(false);
                            });
                    }}>
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit} className='h-full'>
                            <div className='w-[100%] h-[100%] flex justify-center items-center'>
                                <div className='w-[40%] 2xl:w-[80%] min-w-[400px] bg-white rounded-lg px-10 py-10 border shadow-md 2xl:border-none 2xl:shadow-none'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-[#009585] text-2xl font-bold'>Forgot Password</span>
                                        <Link to="/auth/signin" className='hover:underline'><span className='text-[#009585]'>Back to Login</span></Link>
                                    </div>
                                    <div className='mt-8 flex flex-col items-start'>
                                        <span>Email Address</span>
                                        <input id="email-login" type="email" placeholder='Enter your email' name="email" value={values.email} onBlur={handleBlur} onChange={handleChange} error={Boolean(touched.email && errors.email)} className='w-full mt-2 bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2' />
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
                                        <input placeholder='Enter your password' type={showPassword ? 'text' : 'password'} name="password" value={values.password} onBlur={handleBlur} onChange={handleChange} error={Boolean(touched.password)} className='w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2' />
                                        <div className='cursor-pointer absolute top-1/2 right-[5%] -translate-y-1/2' onClick={() => { setShowPassword(!showPassword) }}>{!showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}</div>
                                    </div>
                                    <div className='mt-2 flex flex-col items-start'>
                                        {touched.password && errors.password && (
                                            <span className='text-sm text-red-700'>
                                                {errors.password}
                                            </span>
                                        )}
                                    </div>
                                    <div className='mt-5 flex flex-col items-start'>
                                        <span>Confirm Password</span>
                                    </div>
                                    <div className='relative mt-2'>
                                        <input placeholder='Confirm your password' type={showPassword ? 'text' : 'password'} name="confirmPassword" value={values.confirmPassword} onBlur={handleBlur} onChange={handleChange} error={Boolean(touched.confirmPassword)} className='w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2 disabled:border-gray-2' />
                                    </div>
                                    <div className='mt-2 flex flex-col items-start'>
                                        {touched.confirmPassword && errors.confirmPassword && (
                                            <span className='text-sm text-red-700'>
                                                {errors.confirmPassword}
                                            </span>
                                        )}
                                    </div>
                                    <div className='w-full my-7'>
                                        <button disabled={isSubmitting} className='w-full bg-[#009788] rounded-md inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-white hover:bg-body-color hover:border-body-color disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5' type='submit'>
                                            Reset Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    )
                    }
                </Formik >
            </div >
        </div >
    )
}

export default ForgotPassword;