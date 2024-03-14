export interface ISignin {
  user_email: string;
  user_username?: string;
  user_password?: string;
}

export interface ISignup {
  user_fullname: string;
  user_email: string;
  user_password?: string;
  user_confirmPassword?: string;
  user_username?: string;
}

export interface IForgetPassword {
  user_email: string;
  verifyToken: object;
}

export interface IVerifyToken {
  verifyToken: object;
  user_email: string;
}

export interface IChangePasswordForget {
  user_email: string;
  newPassword?: string;
  rePassword?: string;
}

export interface IChangePasswordNew {
  user_password?: string,
  user_email: string;
  newPassword?: string;
  rePassword?: string;
}