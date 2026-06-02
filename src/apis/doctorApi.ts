import axiosClient from '../utils/axios';

export const doctorSignup = async (data: {
  doctorName: string;
  hospitalName: string;
  hospitalPhone: string;
}): Promise<void> => {
  try {
    await axiosClient.post('/doctors/signup', data);
    console.log('Doctor signup successful');
  } catch (error) {
    throw error;
  }
};
