import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { getActiveUser, getNotesForUser, saveNotesForUser } from './utils/storage';

export default function CreateNoteScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSaveNote = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const user = await getActiveUser();
    if (!user) {
      router.replace('../(auth)/login');
      return;
    }

    const userNotes = await getNotesForUser(user);
    
    const newNote = {
      id: Date.now().toString(),
      title: title.trim(),
      body: body.trim(),
      lastUpdated: Date.now(),
    };

    const updatedNotes = [...userNotes, newNote];
    await saveNotesForUser(user, updatedNotes);

    Alert.alert('Success', 'Note created!');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Note</Text>
      
      <TextInput
        style={styles.titleInput}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={styles.bodyInput}
        placeholder="Write your note here..."
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleSaveNote}
        >
          <Text style={styles.saveButtonText}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  titleInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
  },
  bodyInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    fontSize: 16,
    minHeight: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.48,
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});