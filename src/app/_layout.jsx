import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/** Layout raíz: envuelve la app en el proveedor de áreas seguras. */
export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#1a1a2e' },
                }}
            />
        </SafeAreaProvider>
    );
}
