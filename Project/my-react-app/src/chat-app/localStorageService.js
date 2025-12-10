const STORAGE_KEY = "chat_messages";

const getMessages = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMessage = (message) => {
  const messages = getMessages();
  messages.push(message);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

const saveMessages = (messages) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

const clearMessages = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export default {
  getMessages,
  saveMessage,
  saveMessages,
  clearMessages,
};
