import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 400
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="home/index" />
                <Stack.Screen name="destination/index" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}