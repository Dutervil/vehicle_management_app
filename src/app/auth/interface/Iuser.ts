export interface User {
  id: string;
  email: string;
  role: string;
  username: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  password?:string;
}

export interface AuthData {
  token:string,
  user:User
}
