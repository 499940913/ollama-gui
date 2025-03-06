import { getApiUrl } from '../services/api'
const testConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl("/tags"));
    return response.ok;
  } catch (error) {
    console.error("Connection failed:", error);
    return false;
  }
};

export default testConnection;
