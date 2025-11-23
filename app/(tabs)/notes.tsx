import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { getActiveUser, getNotesForUser, saveNotesForUser, clearActiveUser, getImageForNote } from '../utils/storage';

interface Note {
  id: string;
  title: string;
  body: string;
  image: boolean;
  lastUpdated: number;
}

type SortOption = 'newest' | 'oldest' | 'titleAsc' | 'titleDesc';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [currentUser, setCurrentUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchQuery, sortOption]);

  const loadNotes = async () => {
    const user = await getActiveUser();
    if (!user) {
      router.replace('/(auth)/login');
      return;
    }
    setCurrentUser(user);
    const userNotes = await getNotesForUser(user);
    setNotes(userNotes);
  };

  const filterAndSortNotes = () => {
    let filtered = notes;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortOption) {
      case 'newest':
        filtered = [...filtered].sort((a, b) => b.lastUpdated - a.lastUpdated);
        break;
      case 'oldest':
        filtered = [...filtered].sort((a, b) => a.lastUpdated - b.lastUpdated);
        break;
      case 'titleAsc':
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'titleDesc':
        filtered = [...filtered].sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    setFilteredNotes(filtered);
  };

  const deleteNote = async (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            setNotes(updatedNotes);
            await saveNotesForUser(currentUser, updatedNotes);
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    await clearActiveUser();
    router.replace('/(auth)/login');
  };

  const getSortButtonText = () => {
    switch (sortOption) {
      case 'newest': return 'Newest First ▼';
      case 'oldest': return 'Oldest First ▼';
      case 'titleAsc': return 'Title A-Z ▼';
      case 'titleDesc': return 'Title Z-A ▼';
      default: return 'Sort ▼';
    }
  };

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity 
      style={styles.noteCard}
      onPress={() => router.push(`/edit-note?id=${item.id}`)}
    >
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        {item.image && <Text style={styles.imageBadge}>📷</Text>}
      </View>
      <Text style={styles.notePreview}>
        {item.body.length > 50 ? item.body.substring(0, 50) + '...' : item.body}
      </Text>
      <Text style={styles.noteDate}>
        {new Date(item.lastUpdated).toLocaleDateString()} at {new Date(item.lastUpdated).toLocaleTimeString()}
      </Text>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteNote(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome, {currentUser}!</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
        >
          <Text style={styles.sortButtonText}>{getSortButtonText()}</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      {showSortOptions && (
        <View style={styles.sortOptions}>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'newest' && styles.activeSort]}
            onPress={() => { setSortOption('newest'); setShowSortOptions(false); }}
          >
            <Text style={styles.sortOptionText}>Newest First</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'oldest' && styles.activeSort]}
            onPress={() => { setSortOption('oldest'); setShowSortOptions(false); }}
          >
            <Text style={styles.sortOptionText}>Oldest First</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'titleAsc' && styles.activeSort]}
            onPress={() => { setSortOption('titleAsc'); setShowSortOptions(false); }}
          >
            <Text style={styles.sortOptionText}>Title A-Z</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortOption, sortOption === 'titleDesc' && styles.activeSort]}
            onPress={() => { setSortOption('titleDesc'); setShowSortOptions(false); }}
          >
            <Text style={styles.sortOptionText}>Title Z-A</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/create-note')}
      >
        <Text style={styles.addButtonText}>+ Create New Note</Text>
      </TouchableOpacity>

      <Text style={styles.resultsText}>
        {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''} found
        {searchQuery ? ` for "${searchQuery}"` : ''}
      </Text>

      <FlatList
        data={filteredNotes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        style={styles.notesList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
          </Text>
        }
      />
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
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    color: 'black',
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sortButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  sortOptions: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    padding: 5,
  },
  sortOption: {
    padding: 12,
    borderRadius: 6,
  },
  activeSort: {
    backgroundColor: '#E3F2FD',
  },
  sortOptionText: {
    color: 'black',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsText: {
    color: '#666',
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  notesList: {
    flex: 1,
  },
  noteCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
  },
  imageBadge: {
    fontSize: 16,
    marginLeft: 10,
  },
  notePreview: {
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  noteDate: {
    color: '#999',
    fontSize: 12,
    marginBottom: 10,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  deleteText: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 50,
    fontSize: 16,
  },
});