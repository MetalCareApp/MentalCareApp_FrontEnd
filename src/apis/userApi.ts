import axiosClient from '../utils/axios';

export const getMyInfo = async (): Promise<{
  name: string;
  role: 'USER' | 'DOCTOR';
  email: string;
  matchId: number | null;
}> => {
  try {
    const response: {
      name: string;
      role: 'USER' | 'DOCTOR';
      email: string;
      matchId: number | null;
    } = await axiosClient.get('/users/me');
    return response;
  } catch (error) {
    throw error;
  }
};
