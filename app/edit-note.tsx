import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getActiveUser, getNotesForUser, saveNotesForUser, getImageForNote, saveImageForNote } from './utils/storage';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    loadNote();
  }, [id]);

  const loadNote = async () => {
    const user = await getActiveUser();
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    setCurrentUser(user);

    const notes = await getNotesForUser(user);
    const note = notes.find(n => n.id === id);
    
    if (note) {
      setTitle(note.title);
      setBody(note.body);
      
      // Load image if exists
      if (note.image) {
        const savedImageUri = await getImageForNote(user, note.id);
        setImageUri(savedImageUri);
      }
    } else {
      Alert.alert('Error', 'Note not found');
      router.back();
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleUpdateNote = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    const user = await getActiveUser();
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }

    const userNotes = await getNotesForUser(user);
    const noteIndex = userNotes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      Alert.alert('Error', 'Note not found');
      return;
    }

    // Update note
    userNotes[noteIndex] = {
      ...userNotes[noteIndex],
      title: title.trim(),
      body: body.trim(),
      image: imageUri ? true : false,
      lastUpdated: Date.now(),
    };

    // Save image if exists
    if (imageUri) {
      await saveImageForNote(user, id as string, imageUri);
    }

    await saveNotesForUser(user, userNotes);
    Alert.alert('Success', 'Note updated!');
    router.back();
  };

  const removeImage = () => {
    setImageUri(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Note</Text>
      
      <TextInput
        style={styles.titleInput}
        placeholder="Note Title"
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={styles.bodyInput}
        placeholder="Write your note here..."
        placeholderTextColor="#999"
        value={body}
        onChangeText={setBody}
        multiline
        textAlignVertical="top"
      />

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Text style={styles.sectionTitle}>Image</Text>
        
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
              <Text style={styles.removeImageText}>Remove Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageButtonsContainer}>
            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
              <Text style={styles.imageButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]} 
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]} 
          onPress={handleUpdateNote}
        >
          <Text style={styles.saveButtonText}>Update Note</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },
  titleInput: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
    color: 'black',
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
    color: 'black',
  },
  imageSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    flex: 0.48,
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  imagePreviewContainer: {
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  removeImageButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  removeImageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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