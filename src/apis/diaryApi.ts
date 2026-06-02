import axiosClient from '../utils/axios';

export const getAllDiaryByMonth = async (yyyymm: string): Promise<any> => {
  try {
    const response = await axiosClient.get(`/diaries/months/${yyyymm}`);
    console.log('getAllDiaryByMonth API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createDiary = async (data: {
  diaryDate: string;
  emotion: string;
  sleepStartTime: string;
  sleepEndTime: string;
  medicationTaken: boolean;
  medicationReaction: string;
  content: string;
  externalStress: boolean;
}): Promise<any> => {
  try {
    console.log('createDiary API request data:', data);
    const response = await axiosClient.post('/diaries', data);

    console.log('createDiary API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getDiaryDetail = async (diaryId: number): Promise<any> => {
  try {
    const response = await axiosClient.get(`/diaries/${diaryId}`);
    console.log('getDiaryDetail API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateDiary = async (
  diaryId: number,
  data: {
    diaryDate: string;
    emotion: string;
    sleepStartTime: string;
    sleepEndTime: string;
    medicationTaken: boolean;
    medicationReaction: string;
    content: string;
    externalStress: boolean;
  },
): Promise<any> => {
  try {
    console.log('updateDiary API request data:', { diaryId, ...data });
    const response = await axiosClient.patch(`/diaries/${diaryId}`, data);

    console.log('updateDiary API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteDiary = async (diaryId: number): Promise<any> => {
  try {
    const response = await axiosClient.delete(`/diaries/${diaryId}`);
    console.log('deleteDiary API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};
