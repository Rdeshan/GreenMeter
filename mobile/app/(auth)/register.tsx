import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  View,
  Image,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native'
import axios from 'axios'
import { useAuthStore } from '../../store/authStore'
import { useRouter, Link } from 'expo-router'
import { API_BASE } from '../../constants/index'

export default function Register () {
  const setUser = useAuthStore(state => state.setUser)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const passwordsMatch =
    password !== '' && confirmPassword !== '' && password === confirmPassword

  const showError =
    password !== '' && confirmPassword !== '' && password !== confirmPassword

  const handleSignup = async () => {
    try {
      const res = await axios.post<any>(`${API_BASE}/auth/register`, {
        name,
        email,
        password
      })
      setUser(res.data)
      router.replace('/')
    } catch (err: any) {
      console.log(err.response?.data || err.message)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/authscreens.png')}
          style={styles.banner}
        />

        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          placeholder='First Name'
          style={styles.input}
          value={name}
          onChangeText={setName}
          keyboardType='default'
          autoCapitalize='none'
        />
        <TextInput
          placeholder='Email'
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType='email-address'
          autoCapitalize='none'
        />

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder='Password'
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible} // 👈 toggled here
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={22}
            color='#6B7280'
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        </View>
        <View
          style={[
            styles.passwordContainer,
            showError && { borderColor: 'red' },
            passwordsMatch && { borderColor: '#10B981' } // green if matches
          ]}
        >
          <TextInput
            placeholder='Confirm Password'
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible} // 👈 toggled here
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Ionicons
            name={passwordVisible ? 'eye' : 'eye-off'}
            size={22}
            color='#6B7280'
            onPress={() => setPasswordVisible(!passwordVisible)}
          />
        </View>

        {/* 📝 Error message only when they don't match */}
        {showError && (
          <Text style={styles.errorText}>Passwords do not match</Text>
        )}

        <TouchableOpacity
          style={styles.btn}
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Already have an account? <Link href='/(auth)/login'>Login</Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  logo: {
    width: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 0
  },
  banner: {
    width: 900,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 0
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12
  },
  btn: {
    backgroundColor: '#10B981', // Emerald green
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3 // Adds shadow on Android
  },

  btnText: {
    color: '#fff', // White text for contrast
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5
  },

  errorText: {
    color: 'red',
    marginBottom: 12,
    fontSize: 13
  },
  orText: { textAlign: 'center', marginVertical: 20, color: '#6B7280' },
  linkText: { textAlign: 'center', marginTop: 20 }
})
