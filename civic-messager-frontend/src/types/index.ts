export type ILoginForm = {
  username: string;
  password: string;
};

export type IRegisterForm = {
  username: string;
  password: string;
  email: string;
};

export type IUser = {
  id: number;
  username: string;
  email: string;
  avatarUrl: string;
  phoneNumber: string;
  birthdate: string;
};
