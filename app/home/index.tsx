import { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import NavBar from '../../components/NavBar';

export default function HomeScreen() {
    const [isPressed, setIsPressed] = useState(false);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const getBackgroundSource = () => {
        if (screenWidth < 640) {
            return require('../../assets/images/home/background-home-mobile.jpg');
        } else if (screenWidth < 960) {
            return require('../../assets/images/home/background-home-tablet.jpg');
        } else {
            return require('../../assets/images/home/background-home-desktop.jpg');
        }
    };

    const isDesktop = screenWidth >= 960;

    return (
        <View style={[styles.container, isDesktop && styles.desktopContainer]}>
            <ImageBackground
                source={getBackgroundSource()}
                style={[styles.bg, isDesktop && styles.desktopBg]}
                resizeMode="cover"
            >
                <NavBar />
                <ScrollView 
                    style={styles.scrollContainer} 
                    contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.pageTitle}>
                        <Text style={styles.pageNumber}>00</Text>
                        {'     '}HOME
                    </Text>
                    <Text style={styles.h3}>SO, YOU WANT TO TRAVEL TO</Text>
                    <Text style={styles.h1}>SPACE</Text>
                    <Text style={styles.p}>
                        Let&apos;s face it; if you want to go to space, you might as well genuinely go to
                        outer space and not hover kind of on the edge of it. Well sit back, and relax
                        because we&apos;ll give you a truly out of this world experience!
                    </Text>
                    <Pressable
                        style={[styles.explore, isPressed && styles.exploreHover]}
                        onPress={() => router.push('/destination')}
                        onPressIn={() => setIsPressed(true)}
                        onPressOut={() => setIsPressed(false)}
                    >
                        <Text style={[styles.exploreText, isPressed && styles.exploreTextHover]}>
                            EXPLORE
                        </Text>
                    </Pressable>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    desktopContainer: {
        alignItems: 'center',
        backgroundColor: '#0B0D17'
    },
    bg: {
        flex: 1,
        backgroundColor: '#0B0D17'
    },
    desktopBg: {
        width: 960,
        maxWidth: '100%'
    },
    scrollContainer: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        paddingTop: 120,
        alignItems: 'center',
        paddingHorizontal: 36,
        paddingBottom: 50
    },
    desktopContent: {
        paddingHorizontal: 24
    },
    pageTitle: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 16,
        letterSpacing: 2.7,
        color: '#FFFFFF',
        marginBottom: 32,
        textAlign: 'center'
    },
    pageNumber: {
        fontWeight: '700',
        opacity: 0.25
    },
    h3: {
        color: '#D0D6F9',
        letterSpacing: 3,
        fontSize: 16,
        marginBottom: 12,
        fontFamily: 'BarlowCondensed_400Regular'
    },
    h1: {
        color: '#FFFFFF',
        fontSize: 80,
        lineHeight: 88,
        margin: 16,
        fontFamily: 'Bellefair_400Regular'
    },
    p: {
        color: '#D0D6F9',
        textAlign: 'center',
        fontSize: 15,
        lineHeight: 25,
        maxWidth: 444,
        marginBottom: 40,
        fontFamily: 'Barlow_400Regular'
    },
    explore: {
        width: 274,
        height: 274,
        borderRadius: 137,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center'
    },
    exploreHover: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 80,
        elevation: 20
    },
    exploreText: {
        fontSize: 32,
        fontFamily: 'Bellefair_400Regular',
        letterSpacing: 2,
        color: '#0B0D17'
    },
    exploreTextHover: {
        color: 'rgba(11, 13, 23, 0.5)'
    }
});