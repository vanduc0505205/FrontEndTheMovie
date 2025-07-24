export interface IUser {
  _id?: string;
  username: string;
  email: string;
  password?: string;
  role?: 'staff' | 'customer' | 'admin';
  resetToken?: string | null;
  resetTokenExpires?: string | null;
  createdAt?: string;
  updatedAt?: string;
}