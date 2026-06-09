import axiosClient from '../utils/axios';

export type AIReport = {
  id: number;
  matchId: number;
  startDate: string;
  endDate: string;
  content: string;
  totalScore: number;
  riskLevel: string;
  phq9Slots: string;
  doctorNote: string;
  treatmentRecommendation: string;
  createdAt: string;
};

export type AIReportDetail = {
  id: number;
  patientName: string;
  matchId: number;
  startDate: string;
  endDate: string;
  content: string;
  totalScore: number;
  riskLevel: string;
  phq9Slots: string;
  treatmentRecommendation: string;
  doctorNote: string;
  createdAt: string;
  dailyDetails: {
    date: string;
    emotionScore: number;
    sleepHours: number;
    medicationTaken: boolean;
    externalStress: boolean;
  }[];
};

export const getMyReports = async (): Promise<AIReport[]> => {
  try {
    const response: AIReport[] = await axiosClient.get('/reports');
    console.log('getMyReports API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getReportDetail = async (
  reportId: number,
): Promise<AIReportDetail> => {
  try {
    const response: AIReportDetail = await axiosClient.get(
      `/reports/${reportId}`,
    );
    console.log('getReportDetail API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createReport = async (data: {
  startDate: string;
  endDate: string;
}): Promise<AIReportDetail> => {
  try {
    const response: AIReportDetail = await axiosClient.post('/ai/report', data);
    console.log('createReport API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};
