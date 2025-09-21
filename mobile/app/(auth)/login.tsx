import { View, TextInput, Button, StyleSheet, Text } from 'react-native'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuthStore } from '../../store/authStore'
import { useRouter, Link } from 'expo-router'
import * as AuthSession from 'expo-auth-session'

export default function Login () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setUser = useAuthStore(state => state.setUser)
  const router = useRouter()

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '<YOUR_GOOGLE_CLIENT_ID>',
      redirectUri: AuthSession.makeRedirectUri({ scheme: 'yourapp' }),
      scopes: ['profile', 'email']
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  )

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params
      axios
        .post('http://<your-backend>/auth/google', { access_token })
        .then(res => {
          setUser(res.data.user)
          router.replace('../(tabs)/index')
        })
    }
  }, [response])

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://<your-backend>/auth/login', {
        email,
        password
      })
      setUser(res.data.user)
      router.replace('../(tabs)/index')
    } catch (err: any) {
      console.log(err.response?.data || err.message)
    }
  }

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title='Login' onPress={handleLogin} />
      <Button title="Login with Google" onPress={() => promptAsync()} disabled={!request} />
      <Link href='/(auth)/register'>No account? Register</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5 }
})
