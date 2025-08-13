import { useEffect } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import NavBar from '../../components/NavBar';

export default function HomeScreen() {
    useEffect(() => {
        AsyncStorage.setItem('lastScreen', 'Home');
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/images/home/bg-home-mob.jpg')}
            style={styles.bg}
            resizeMode="cover"
        >
            <NavBar />
            <View style={styles.content}>
                <Text style={styles.h3}>SO, YOU WANT TO TRAVEL TO</Text>
                <Text style={styles.h1}>SPACE</Text>
                <Text style={styles.p}>
                    Let&apos;s face it; if you want to go to space, you might as well genuinely go to
                    outer space and not hover kind of on the edge of it. Well sit back, and relax
                    because we&apos;ll give you a truly out of this world experience!
                </Text>
                <Pressable
                    style={styles.explore}
                    onPress={() => {
                        AsyncStorage.setItem('lastScreen', 'Destination');
                        router.push('/destination');
                    }}
                >
                    <Text style={styles.exploreText}>EXPLORE</Text>
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
    content: {
        flex: 1,
        paddingTop: 120,
        alignItems: 'center',
        paddingHorizontal: 36
    },
    h3: {
        color: '#D0D6F9',
        letterSpacing: 3,
        fontSize: 16,
        marginBottom: 12,
        fontWeight: '400'
    },
    h1: {
        color: '#ffffff',
        fontSize: 80,
        lineHeight: 88,
        margin: 16,
        fontWeight: '400'
    },
    p: {
        color: '#D0D6F9',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 25,
        maxWidth: 444,
        marginBottom: 40
    },
    explore: {
        width: 274,
        height: 274,
        borderRadius: 137,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    exploreText: {
        fontSize: 32,
        fontWeight: '400',
        letterSpacing: 2,
        color: '#0B0D17'
    }
});