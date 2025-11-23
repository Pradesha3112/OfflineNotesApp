import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { getActiveUser, clearActiveUser } from '../utils/storage';

export default function NotesScreen() {
  const [currentUser, setCurrentUser] = useState('');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await getActiveUser();
    setCurrentUser(user || 'No user');
  };

  const handleLogout = async () => {
    await clearActiveUser();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Notes!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.userText}>Logged in as: {currentUser}</Text>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/create-note')}
      >
        <Text style={styles.addButtonText}>+ Create New Note</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  userText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoText: {
    textAlign: 'center',
    color: 'green',
    fontSize: 18,
    marginTop: 20,
  },
});