import AppConstants from '../utils/AppConstants';
import axiosClient from '../utils/axios';
import StorageHelper from '../utils/StorageHelper';

export const googleLogin = async (idToken: string) => {
  try {
    const { accessToken }: { accessToken: string } = await axiosClient.post(
      '/users/login',
      { idToken },
    );
    StorageHelper.storeData(AppConstants.STORAGE_KEYS.LOGIN_TOKEN, accessToken);
    axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return { accessToken };
  } catch (error) {
    throw error;
  }
};
