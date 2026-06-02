import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageHelper = {
  async storeData(key: string, data: string): Promise<boolean> {
    try {
      await AsyncStorage.setItem(key, data);
      return true;
    } catch (e) {
      return false;
    }
  },
  async getData(key: string): Promise<any> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  async storeObject(key: string, value: any): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      return false;
    }
  },
  async getObject(key: string): Promise<any> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  },
  async removeData(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },
  async clearStorage(): Promise<boolean> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (e) {
      return false;
    }
  },
};

export default StorageHelper;
