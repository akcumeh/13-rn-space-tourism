import { useEffect } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function Index() {
    useEffect(() => {
        // Always start at home
        router.replace('/home');
    }, []);

    return <View style={{ flex: 1, backgroundColor: '#0B0D17' }} />;
}