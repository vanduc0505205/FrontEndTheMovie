export interface IUser {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  password?: string;
  role?: 'staff' | 'customer' | 'admin';
  status?: 'active' | 'blocked';
  avatar?: string;
  resetToken?: string | null;
  resetTokenExpires?: string | null;
  createdAt?: string;
  updatedAt?: string;
  googleId?: string;
  provider?: 'local' | 'google';
}

export interface IUpdateProfile {
  username?: string;
  password?: string; // Nếu cho đổi
  avatar?: string;
}
