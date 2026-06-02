import axiosClient from '../utils/axios';

export type TestResult = {
  id: number;
  type: string;
  createdAt: string;
  score: number;
  severity: string;
};

export const getAllExaminations = async (): Promise<TestResult[]> => {
  try {
    const response: TestResult[] = await axiosClient.get('/examinations');
    console.log('getAllExaminations API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPHQ9Examination = async (scores: number[]): Promise<any> => {
  try {
    const response = await axiosClient.post(`/examinations/phq-9`, { scores });
    console.log('createPHQ9Examination API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createGAD7Examination = async (scores: number[]): Promise<any> => {
  try {
    const response = await axiosClient.post(`/examinations/gad-7`, { scores });
    console.log('createGAD7Examination API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};
