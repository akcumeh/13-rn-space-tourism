import { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import NavBar from '../../components/NavBar';

export default function HomeScreen() {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const scaleAnim = useState(new Animated.Value(1))[0];
    const ringAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    const handlePressIn = () => {
        setIsPressed(true);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
            }),
            Animated.timing(ringAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handlePressOut = () => {
        setIsPressed(false);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
            Animated.timing(ringAnim, {
                toValue: isHovered ? 0.7 : 0,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start();
    };

    const handleHoverIn = () => {
        if (screenWidth >= 960) { // Only on desktop
            setIsHovered(true);
            Animated.timing(ringAnim, {
                toValue: 0.7,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleHoverOut = () => {
        if (screenWidth >= 960) { // Only on desktop
            setIsHovered(false);
            Animated.timing(ringAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

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
                    {!isDesktop && (
                        <Text style={styles.pageTitle}>
                            <Text style={styles.pageNumber}>00</Text>
                            {'  '}HOME
                        </Text>
                    )}
                    
                    {isDesktop ? (
                        <View style={styles.desktopLayout}>
                            <View style={styles.leftColumn}>
                                <Text style={styles.h3}>SO, YOU WANT TO TRAVEL TO</Text>
                                <Text style={styles.h1}>SPACE</Text>
                                <Text style={styles.p}>
                                    Let&apos;s face it; if you want to go to space, you might as well genuinely go to
                                    outer space and not hover kind of on the edge of it. Well sit back, and relax
                                    because we&apos;ll give you a truly out of this world experience!
                                </Text>
                            </View>
                            <View style={styles.rightColumn}>
                                <View style={styles.exploreContainer}>
                                    <Animated.View 
                                        style={[
                                            styles.exploreRing,
                                            {
                                                opacity: ringAnim,
                                                transform: [{
                                                    scale: ringAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [1, 1.5]
                                                    })
                                                }]
                                            }
                                        ]}
                                    />
                                    <Animated.View
                                        style={[
                                            styles.explore,
                                            {
                                                transform: [{ scale: scaleAnim }]
                                            }
                                        ]}
                                    >
                                        <Pressable
                                            style={styles.exploreButton}
                                            onPress={() => router.push('/destination')}
                                            onPressIn={handlePressIn}
                                            onPressOut={handlePressOut}
                                            onHoverIn={handleHoverIn}
                                            onHoverOut={handleHoverOut}
                                        >
                                            <Text style={styles.exploreText}>
                                                EXPLORE
                                            </Text>
                                        </Pressable>
                                    </Animated.View>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.h3}>SO, YOU WANT TO TRAVEL TO</Text>
                            <Text style={styles.h1}>SPACE</Text>
                            <Text style={styles.p}>
                                Let&apos;s face it; if you want to go to space, you might as well genuinely go to
                                outer space and not hover kind of on the edge of it. Well sit back, and relax
                                because we&apos;ll give you a truly out of this world experience!
                            </Text>
                            <View style={styles.exploreContainer}>
                                <Animated.View 
                                    style={[
                                        styles.exploreRing,
                                        {
                                            opacity: ringAnim,
                                            transform: [{
                                                scale: ringAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [1, 1.5]
                                                })
                                            }]
                                        }
                                    ]}
                                />
                                <Animated.View
                                    style={[
                                        styles.explore,
                                        {
                                            transform: [{ scale: scaleAnim }]
                                        }
                                    ]}
                                >
                                    <Pressable
                                        style={styles.exploreButton}
                                        onPress={() => router.push('/destination')}
                                        onPressIn={handlePressIn}
                                        onPressOut={handlePressOut}
                                        onHoverIn={handleHoverIn}
                                        onHoverOut={handleHoverOut}
                                    >
                                        <Text style={styles.exploreText}>
                                            EXPLORE
                                        </Text>
                                    </Pressable>
                                </Animated.View>
                            </View>
                        </>
                    )}
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;

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
        width: screenWidth,
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
        paddingHorizontal: 80,
        paddingTop: 200,
        alignItems: 'stretch'
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: 500
    },
    leftColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingRight: 40,
        paddingBottom: 50
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 50
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
    exploreContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    exploreRing: {
        position: 'absolute',
        width: 274,
        height: 274,
        borderRadius: 137,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    explore: {
        width: 274,
        height: 274,
        borderRadius: 137,
        backgroundColor: '#FFFFFF',
    },
    exploreButton: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 137,
    },
    exploreText: {
        fontSize: 32,
        fontFamily: 'Bellefair_400Regular',
        letterSpacing: 2,
        color: '#0B0D17'
    }
});