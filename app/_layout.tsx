import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="create-note" 
          options={{ 
            headerShown: true, 
            title: 'Create Note',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="edit-note" 
          options={{ 
            headerShown: true, 
            title: 'Edit Note',
            presentation: 'modal',
          }} 
        />
      </Stack>
    </>
  );
}