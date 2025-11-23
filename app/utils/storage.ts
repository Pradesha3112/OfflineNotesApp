import AsyncStorage from '@react-native-async-storage/async-storage';

// USERS - Simple version
export const storeUsers = async (users: any[]) => {
  try {
    console.log('Storing users:', users);
    const jsonValue = JSON.stringify(users);
    await AsyncStorage.setItem('@users', jsonValue);
    console.log('Users stored successfully');
  } catch (e) {
    console.error('Error saving users:', e);
  }
};

export const getUsers = async (): Promise<any[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@users');
    const users = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log('Retrieved users:', users);
    return users;
  } catch (e) {
    console.error('Error loading users:', e);
    return [];
  }
};

// ACTIVE USER
export const setActiveUser = async (username: string) => {
  try {
    console.log('Setting active user:', username);
    await AsyncStorage.setItem('@active_user', username);
    console.log('Active user set successfully');
  } catch (e) {
    console.error('Error setting active user:', e);
  }
};

export const getActiveUser = async (): Promise<string | null> => {
  try {
    const user = await AsyncStorage.getItem('@active_user');
    console.log('Retrieved active user:', user);
    return user;
  } catch (e) {
    console.error('Error getting active user:', e);
    return null;
  }
};

export const clearActiveUser = async () => {
  try {
    await AsyncStorage.removeItem('@active_user');
    console.log('Active user cleared');
  } catch (e) {
    console.error('Error clearing active user:', e);
  }
};

// NOTES
export const getNotesForUser = async (username: string): Promise<any[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`@notes_${username}`);
    const notes = jsonValue != null ? JSON.parse(jsonValue) : [];
    console.log(`Retrieved notes for ${username}:`, notes);
    return notes;
  } catch (e) {
    console.error('Error loading notes:', e);
    return [];
  }
};

export const saveNotesForUser = async (username: string, notes: any[]) => {
  try {
    console.log(`Saving notes for ${username}:`, notes);
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(`@notes_${username}`, jsonValue);
    console.log('Notes saved successfully');
  } catch (e) {
    console.error('Error saving notes:', e);
  }
};
// Add this to your existing storage functions
export const saveImageForNote = async (username: string, noteId: string, imageUri: string) => {
  try {
    await AsyncStorage.setItem(`@image_${username}_${noteId}`, imageUri);
  } catch (e) {
    console.error('Error saving image:', e);
  }
};

export const getImageForNote = async (username: string, noteId: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(`@image_${username}_${noteId}`);
  } catch (e) {
    console.error('Error getting image:', e);
    return null;
  }
};