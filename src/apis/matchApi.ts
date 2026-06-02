import axiosClient from '../utils/axios';

export type Match = {
  id: number;
  doctorId: number;
  doctorName: string;
  hospitalName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  patientName: string;
  patientId: number;
  createdAt: string;
};

export type MyHospital = {
  matchId: number;
  hospitalName: string;
  address: string;
  phone: string;
  doctorName: string;
  openingAt: string;
};

export type PatientSearchResult = {
  userId: number;
  name: string;
  email: string;
  matchStatus: 'PENDING' | 'ACCEPTED';
};

export type Patient = {
  userId: number;
  name: string;
  email: string;
  matchId: number;
  registeredAt: string;
};

export type PatientDetail = {
  userId: number;
  name: string;
  email: string;
  matchCreatedAt: string;
  reports: Report[];
};

export type Report = {
  id: number;
  createdAt: string;
};

export const getMyMatches = async (): Promise<Match[]> => {
  try {
    const response: Match[] = await axiosClient.get('/matches/requests');
    console.log('getMyMatches API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMatchByMatchId = async (
  matchId: number,
): Promise<MyHospital> => {
  try {
    const response: MyHospital = await axiosClient.get(`/matches/${matchId}`);
    console.log(
      `getMatchByMatchId API response for matchId ${matchId}:`,
      response,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const requestMatch = async (patientEmail: string): Promise<void> => {
  try {
    await axiosClient.post('/matches', { patientEmail });
    console.log(`Match request sent to doctor ${patientEmail} successfully.`);
  } catch (error) {
    throw error;
  }
};

export const rejectMatch = async (matchId: number): Promise<void> => {
  try {
    await axiosClient.patch(`/matches/${matchId}/reject`);
    console.log(`Match ${matchId} rejected successfully.`);
  } catch (error) {
    throw error;
  }
};

export const acceptMatch = async (matchId: number): Promise<void> => {
  try {
    await axiosClient.patch(`/matches/${matchId}/accept`);
    console.log(`Match ${matchId} accepted successfully.`);
  } catch (error) {
    throw error;
  }
};

export const cancelMatch = async (matchId: number): Promise<void> => {
  try {
    await axiosClient.delete(`/matches/${matchId}`);
    console.log(`Match ${matchId} cancelled successfully.`);
  } catch (error) {
    throw error;
  }
};

export const searchPatientByEmail = async (
  email: string,
): Promise<PatientSearchResult[]> => {
  try {
    const response: PatientSearchResult[] = await axiosClient.get(
      `/matches/search?email=${email}`,
    );
    console.log(
      `searchPatientByEmail API response for email ${email}:`,
      response,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getMyPatientList = async (): Promise<Patient[]> => {
  try {
    const response: Patient[] = await axiosClient.get('/matches');
    console.log('getMyPatientList API response:', response);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPatientDetail = async (
  matchId: number,
): Promise<PatientDetail> => {
  try {
    const response: PatientDetail = await axiosClient.get(
      `/matches/${matchId}/details`,
    );
    console.log(
      `getPatientDetail API response for matchId ${matchId}:`,
      response,
    );
    return response;
  } catch (error) {
    throw error;
  }
};
