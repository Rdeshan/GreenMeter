import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/useColorScheme'
import { useAuthStore } from '@/store/authStore'

export default function RootLayout () {
  const colorScheme = useColorScheme()
  const user = useAuthStore(state => state.user)

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  })

  if (!loaded) return null

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {user ? (
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name='(auth)' options={{ headerShown: false }} />
        )}
        <Stack.Screen
          name='consumption-detail/[id]/index'
          options={{
            headerShown: false, // 👈 this hides the header
            presentation: 'card'
          }}
        />
        <Stack.Screen name='+not-found' />
      </Stack>
      <StatusBar style='auto' />
    </ThemeProvider>
  )
}
