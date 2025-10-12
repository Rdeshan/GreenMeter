import { Ionicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native'
import axios from 'axios'
import { useAuthStore } from '../../store/authStore'
import { useRouter, Link } from 'expo-router'
import { API_BASE } from '../../constants/index'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const setUser = useAuthStore(state => state.setUser)
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const res = await axios.post<any>(`${API_BASE}/auth/login`, {
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
        {/* ✅ Logo at top */}
        <Image
          source={require('../../assets/images/authscreens.png')}
          style={styles.banner}
        />

        <Text style={styles.title}>Login</Text>

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

        <TouchableOpacity
          style={styles.btn}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.linkText}>
          Don't have an account? <Link href='/(auth)/register'>Sign up</Link>
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
  orText: { textAlign: 'center', marginVertical: 20, color: '#6B7280' },
  linkText: { textAlign: 'center', marginTop: 20 },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 16
  },
  googleIcon: {
    marginRight: 8
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500'
  }
})
