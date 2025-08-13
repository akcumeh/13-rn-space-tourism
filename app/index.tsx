import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

export default function Index() {
    useEffect(() => {
        const getLastScreen = async () => {
            try {
                const lastScreen = await AsyncStorage.getItem('lastScreen');
                if (lastScreen === 'Destination') {
                    router.replace('/destination');
                } else {
                    router.replace('/home');
                }
            } catch (error) {
                console.log('Error reading last screen:', error);
                router.replace('/home');
            }
        };
        getLastScreen();
    }, []);

    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
}