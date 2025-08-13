import { useEffect } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import NavBar from '../../components/NavBar';

export default function DestinationScreen() {
    useEffect(() => {
        AsyncStorage.setItem('lastScreen', 'Destination');
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/images/destination/bg-dest-mob.jpg')}
            style={styles.bg}
            resizeMode="cover"
        >
            <NavBar />
            <View style={styles.center}>
                <Text style={styles.text}>This is the destination page</Text>
                <Pressable
                    style={styles.btn}
                    onPress={() => {
                        AsyncStorage.setItem('lastScreen', 'Home');
                        router.push('/home');
                    }}
                >
                    <Text style={styles.btnText}>Back to Home</Text>
                </Pressable>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: '#000'
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24
    },
    text: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 16
    },
    btn: {
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 8
    },
    btnText: {
        fontWeight: '700',
        color: '#000'
    }
});