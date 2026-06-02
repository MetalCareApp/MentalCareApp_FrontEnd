import axiosClient from '../utils/axios';

export type Hospital = {
  id: number;
  name: string;
  address: string;
  phone: string;
  openingDate: string;
  specialistCount: number;
  generalDoctorCount: number;
  liked: boolean;
};

export type HospitalDetail = {
  id: number;
  name: string;
  apiId: number;
  address: string;
  openingDate: string;
  phone: string;
  specialistCount: number;
  generalDoctorCount: number;
  liked: boolean;
};

export const getAllHospitals = async (
  name?: string,
  region?: string,
): Promise<Hospital[]> => {
  try {
    let query = '';
    if (name) {
      query += `name=${encodeURIComponent(name)}&`;
    }
    if (region) {
      query += `region=${encodeURIComponent(region)}&`;
    }
    if (query) {
      query = '?' + query.slice(0, -1); // 마지막 '&' 제거
    }

    const response: Hospital[] = await axiosClient.get(`/hospitals${query}`);
    console.log('getAllHospitals API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getHospitalDetails = async (
  hospitalId: number,
): Promise<HospitalDetail> => {
  try {
    const response: HospitalDetail = await axiosClient.get(
      `/hospitals/${hospitalId}`,
    );
    console.log('getHospitalDetails API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getFavoriteHospitals = async (): Promise<Hospital[]> => {
  try {
    const response: Hospital[] = await axiosClient.get('/hospitals/likes');
    console.log('getFavoriteHospitals API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const likeHospital = async (hospitalId: number): Promise<any> => {
  try {
    const response = await axiosClient.post(`/hospitals/${hospitalId}/likes`);
    console.log('likeHospital API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const unlikeHospital = async (hospitalId: number): Promise<any> => {
  try {
    const response = await axiosClient.delete(`/hospitals/likes/${hospitalId}`);
    console.log('unlikeHospital API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};
