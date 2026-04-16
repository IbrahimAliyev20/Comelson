import {
  postChangePassword,
  postForgotPassword,
  postLogin,
  postLogout,
  postRegister,
  postResendOtp,
  postResetPassword,
  postUpdateProfile,
  postVerifyOtp,
} from './api'

export const postLoginMutation = () =>
  ({
    mutationKey: ['auth', 'login'] as const,
    mutationFn: postLogin,
  }) as const

export const postRegisterMutation = () =>
  ({
    mutationKey: ['auth', 'register'] as const,
    mutationFn: postRegister,
  }) as const

export const postVerifyOtpMutation = () =>
  ({
    mutationKey: ['auth', 'verify-otp'] as const,
    mutationFn: postVerifyOtp,
  }) as const

export const postResendOtpMutation = () =>
  ({
    mutationKey: ['auth', 'resend-otp'] as const,
    mutationFn: postResendOtp,
  }) as const

export const postForgotPasswordMutation = () =>
  ({
    mutationKey: ['auth', 'forgot-password'] as const,
    mutationFn: postForgotPassword,
  }) as const

export const postResetPasswordMutation = () =>
  ({
    mutationKey: ['auth', 'reset-password'] as const,
    mutationFn: postResetPassword,
  }) as const

export const postChangePasswordMutation = () =>
  ({
    mutationKey: ['auth', 'change-password'] as const,
    mutationFn: postChangePassword,
  }) as const

export const postLogoutMutation = () =>
  ({
    mutationKey: ['auth', 'logout'] as const,
    mutationFn: postLogout,
  }) as const

export const postUpdateProfileMutation = () =>
  ({
    mutationKey: ['auth', 'profile-update'] as const,
    mutationFn: postUpdateProfile,
  }) as const
