import { Stack } from "expo-router";
import '../global.css';
export default function RootLayout() {
<<<<<<< Updated upstream
  return <Stack screenOptions={{ headerShown: false }} />;
=======
  const colorScheme = useColorScheme();
  const user = useAuthStore((state) => state.user);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {!user ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
>>>>>>> Stashed changes
}
