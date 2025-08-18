import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Bellefair_400Regular } from '@expo-google-fonts/bellefair';
import { Barlow_400Regular } from '@expo-google-fonts/barlow';
import { BarlowCondensed_400Regular } from '@expo-google-fonts/barlow-condensed';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Bellefair_400Regular,
        Barlow_400Regular,
        BarlowCondensed_400Regular,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 250
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="home/index" />
                <Stack.Screen name="destination/index" />
                <Stack.Screen name="crew/index" />
                <Stack.Screen name="technology/index" />
            </Stack>
            <StatusBar style="light" />
        </>
    );
}