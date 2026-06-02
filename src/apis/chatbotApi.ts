import axiosClient from '../utils/axios';

export type ChatbotResponse = {
  id: number;
  content: string;
  createdAt: string;
  role: 'USER' | 'ASSISTANT';
  risk: boolean;
};

export const sendMessageToChatbot = async (
  question: string,
): Promise<ChatbotResponse> => {
  try {
    const response: any = await axiosClient.post('/ai/chat', { question });
    console.log('Chatbot API response:', response);
    return response; // 서버에서 'reply' 필드로 응답한다고 가정
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
};

export const getChatHistory = async (): Promise<ChatbotResponse[]> => {
  try {
    const response: ChatbotResponse[] = await axiosClient.get('/ai/chat');
    console.log('Chat history API response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};
