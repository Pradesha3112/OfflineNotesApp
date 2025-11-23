
# 📝 Offline Multi-User Notes App

A beautiful and feature-rich React Native mobile application that allows multiple users to create, manage, and organize notes completely offline. Built with Expo and TypeScript for a seamless cross-platform experience.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### 🔐 Authentication
- **Multi-user support** - Multiple users can use the same app on the same device
- **Offline authentication** - No internet required for signup or login
- **Secure local storage** - User credentials stored securely using AsyncStorage
- **Session management** - Automatic login persistence

### 📒 Notes Management
- **Create notes** - Rich text notes with titles and descriptions
- **Edit notes** - Full CRUD operations (Create, Read, Update, Delete)
- **Image support** - Attach images from camera or gallery
- **Search functionality** - Find notes by title or content
- **Sorting options** - Sort by date (newest/oldest) or title (A-Z/Z-A)
- **Offline storage** - All data persists locally

### 🎨 User Experience
- **Beautiful animations** - Smooth transitions and interactive feedback
- **Modern UI design** - Clean, intuitive interface
- **Responsive design** - Optimized for mobile devices
- **Dark/Light theme** - Consistent visual experience

## 📸 App Screenshots

| Login Screen | Sign Up Screen | Notes List | Create Note |
|--------------|----------------|------------|-------------|
| ![Login]() | ![SignUp]() | ![Notes]() | ![Create]() |

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Expo CLI
- Android/iOS device or emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pradesha3112/OfflineNotesApp.git
   cd OfflineNotesApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go app (Android)
   - Or press 'i' for iOS simulator / 'a' for Android emulator

### Building for Production

#### Android APK
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Build APK
eas build --platform android --profile preview
```

#### iOS (Requires Apple Developer Account)
```bash
eas build --platform ios --profile preview
```

## 🛠️ Tech Stack

- **Frontend Framework**: React Native
- **Navigation**: Expo Router
- **Language**: TypeScript
- **Storage**: AsyncStorage
- **Image Handling**: Expo Image Picker
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons
- **Development**: Expo SDK

## 📁 Project Structure

```
OfflineNotesApp/
├── app/
│   ├── (auth)/                 # Authentication flows
│   │   ├── login.tsx          # Login screen
│   │   └── signup.tsx         # Sign up screen
│   ├── (tabs)/                # Bottom tab navigation
│   │   ├── index.tsx          # Home redirect
│   │   └── notes.tsx          # Notes list screen
│   ├── create-note.tsx        # Create new note
│   ├── edit-note.tsx          # Edit existing note
│   ├── utils/
│   │   └── storage.ts         # Data persistence utilities
│   └── _layout.tsx            # Root layout configuration
├── assets/                    # Images, fonts, and other assets
├── app.json                   # Expo configuration
└── package.json              # Dependencies and scripts
```

## 🔧 Key Components

### Storage Management (`app/utils/storage.ts`)
- User authentication data handling
- Notes CRUD operations
- Image storage management
- Session persistence

### Authentication Flow
- Secure local user registration
- Session-based authentication
- Multi-user isolation
- Automatic logout functionality

### Notes Features
- Rich text editing
- Image attachment from camera/gallery
- Advanced search and filtering
- Multiple sorting options
- Real-time updates

## 🎯 Usage Guide

### Creating an Account
1. Launch the app
2. Tap "Sign Up"
3. Enter username and password
4. Account created instantly - no internet required!

### Creating Notes
1. Login to your account
2. Tap "+ Create New Note"
3. Add title and content
4. Optional: Attach image from camera or gallery
5. Save - note is stored locally

### Managing Notes
- **Search**: Use search bar to find notes by content
- **Sort**: Choose from 4 sorting options
- **Edit**: Tap any note to modify
- **Delete**: Swipe or use delete button
- **Images**: View attached images in note details

## 📋 API Reference

### Storage Functions

```typescript
// User Management
storeUsers(users: User[]): Promise<void>
getUsers(): Promise<User[]>
setActiveUser(username: string): Promise<void>
getActiveUser(): Promise<string | null>

// Notes Management
getNotesForUser(username: string): Promise<Note[]>
saveNotesForUser(username: string, notes: Note[]): Promise<void>
getNoteById(username: string, noteId: string): Promise<Note | null>

// Image Handling
saveImageForNote(username: string, noteId: string, imageUri: string): Promise<void>
getImageForNote(username: string, noteId: string): Promise<string | null>
```

## 🐛 Troubleshooting

### Common Issues

1. **App won't start**
   - Clear cache: `npx expo start -c`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **Images not loading**
   - Check storage permissions
   - Ensure camera/gallery permissions are granted

3. **Notes not saving**
   - Verify AsyncStorage is working
   - Check device storage space

### Debug Mode
Enable debug logs by checking the console output in your terminal during development.

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, fork the repository, and create pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community for continuous support
- Contributors and testers who helped improve the app

## 📞 Support

If you have any questions or need help with the app:

- Create an [Issue](https://github.com/Pradesha3112/OfflineNotesApp/issues)
- Check [Discussions](https://github.com/Pradesha3112/OfflineNotesApp/discussions)
- Contact: [Your Email or Contact Info]

---

**⭐ Don't forget to star this repository if you found it helpful!**

---

<div align="center">

### Built with ❤️ using React Native & Expo

</div>

## 🚀 Deployment Status

| Platform | Status | Download |
|----------|--------|----------|
| Android APK | ✅ Ready | [Download APK](https://github.com/Pradesha3112/OfflineNotesApp/releases) |
| iOS | 🔄 In Progress | Coming Soon |
| Web | ❌ Not Supported | - |

---

**Note**: This app works completely offline - no internet connection required after installation! 🌐📴
