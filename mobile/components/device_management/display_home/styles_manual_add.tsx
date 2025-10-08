import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    height:15,
    backgroundColor: "#F0F9F4" 
  },
  wrapper: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  // header row for back arrow + title
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backText: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '600',
  },
  headerSpacer: { width: 40 }, // keeps title centered visually

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    flex: 1,
  },

  field: {
    marginBottom: 12
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e6e9ef',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  },

  // AI Button styles
  aiButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    position: 'relative',
  },
  glowEffect: {
    position: 'absolute',
    width: screenWidth * 0.8,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  waveBorder: {
    position: 'absolute',
    width: screenWidth * 0.8 + 6,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#667eea',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  waveBorder2: {
    width: screenWidth * 0.8 + 12,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
    borderColor: '#764ba2',
    opacity: 0.6,
  },
  particleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  aiButton: {
    width: screenWidth * 0.8,
    height: 60,
    borderRadius: 30,
    zIndex: 2,
  },
  aiButtonInner: {
    flex: 1,
    borderRadius: 30,
    overflow: 'hidden',
  },
  aiButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#667eea', // fallback for React Native
    position: 'relative',
  },
   titlee: {
    fontSize: 32,
    fontWeight: "800",
    color: "#16a34a",
    textAlign: "center",
    marginBottom:50,
    marginTop:40,
  },
  aiIcon: {
    marginRight: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconText: {
    fontSize: 16,
    color: '#ffffff',
  },
  aiButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  aiAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
  },
});