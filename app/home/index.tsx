import { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import NavBar from '../../components/NavBar';
import useSwipe from '@/hooks/useSwipe';
import useDimensions from '@/hooks/useDimensions';
// import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const dimensions = useDimensions();
    const scaleAnim = useState(new Animated.Value(1))[0];
    const ringAnim = useState(new Animated.Value(0))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];
    const swipeHandler = useSwipe('home');

    useEffect(() => {
        // Page fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

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
        if (screenWidth >= 960) {
            setIsHovered(true);
            Animated.timing(ringAnim, {
                toValue: 0.7,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleHoverOut = () => {
        if (screenWidth >= 960) {
            setIsHovered(false);
            Animated.timing(ringAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const getBackgroundSource = () => {
        if (dimensions.isMobile) {
            return require('../../assets/images/home/background-home-mobile.jpg');
        } else if (dimensions.isTablet) {
            return require('../../assets/images/home/background-home-tablet.jpg');
        } else {
            return require('../../assets/images/home/background-home-desktop.jpg');
        }
    };

    const styles = createStyles(dimensions);

    return (
        <Animated.View style={[styles.container, dimensions.isDesktop && styles.desktopContainer, { opacity: fadeAnim }]} {...swipeHandler}>
            <ScrollView>
                <ImageBackground
                    source={getBackgroundSource()}
                    style={[styles.bg, dimensions.isDesktop && styles.desktopBg]}
                    resizeMode="cover"
                >
                    <NavBar />
                    <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={[styles.content, dimensions.isDesktop && styles.desktopContent]}
                        showsVerticalScrollIndicator={false}
                    >
                        {!dimensions.isDesktop && (
                            <Text style={styles.pageTitle}>
                                <Text style={styles.pageNumber}>00</Text>
                                {'  '}HOME
                            </Text>
                        )}

                        {dimensions.dimensions.isDesktop ? (
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
                                                dimensions.isDesktop ? styles.desktopExploreRing : styles.exploreRing,
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
                                                dimensions.isDesktop ? styles.desktopExplore : styles.explore,
                                                {
                                                    transform: [{ scale: scaleAnim }]
                                                }
                                            ]}
                                        >
                                            <Pressable
                                                style={dimensions.isDesktop ? styles.desktopExploreButton : styles.exploreButton}
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
            </ScrollView>
        </Animated.View>
    );
}

const createStyles = (dimensions) => StyleSheet.create({
    container: {
        flex: 1,
        minHeight: dimensions.screenHeight
    },
    desktopContainer: {
        alignItems: 'center',
        backgroundColor: '#0B0D17'
    },
    bg: {
        flex: 1,
        backgroundColor: '#0B0D17',
        minHeight: dimensions.screenHeight
    },
    desktopBg: {
        width: dimensions.screenWidth,
        paddingRight: dimensions.paddingHorizontal * 0.4
    },
    scrollContainer: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
        minHeight: dimensions.screenHeight - (dimensions.paddingVertical * 4),
        paddingTop: dimensions.paddingVertical * 4,
        alignItems: 'center',
        paddingHorizontal: dimensions.paddingHorizontal * 1.5,
        paddingBottom: dimensions.paddingVertical * 2
    },
    desktopContent: {
        paddingHorizontal: dimensions.desktopPaddingHorizontal,
        paddingTop: dimensions.desktopPaddingTop,
        paddingRight: dimensions.screenWidth * 0.08,
        alignItems: 'stretch'
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: dimensions.screenHeight * 0.6
    },
    leftColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingRight: dimensions.smallGap,
        paddingBottom: dimensions.paddingVertical * 2
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: dimensions.paddingVertical * 2
    },
    pageTitle: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: dimensions.bodyFontSize * 0.8,
        letterSpacing: 2.7,
        color: '#FFFFFF',
        marginTop: dimensions.paddingVertical,
        marginBottom: dimensions.smallGap,
        textAlign: 'center'
    },
    desktopPageTitle: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: dimensions.titleFontSize * 0.7,
        letterSpacing: 4.7,
        color: '#FFFFFF',
        marginTop: dimensions.paddingVertical,
        marginBottom: dimensions.mediumGap * 1.2,
        textAlign: 'left'
    },
    pageNumber: {
        fontWeight: 'bold',
        opacity: 0.5
    },
    h3: {
        color: '#D0D6F9',
        letterSpacing: 3,
        fontSize: dimensions.bodyFontSize * 0.8,
        marginBottom: 12,
        fontFamily: 'BarlowCondensed_400Regular'
    },
    h1: {
        color: '#FFFFFF',
        fontSize: dimensions.titleFontSize * 2,
        lineHeight: dimensions.titleFontSize * 2.2,
        margin: 16,
        fontFamily: 'Bellefair_400Regular'
    },
    p: {
        color: '#D0D6F9',
        textAlign: 'center',
        fontSize: dimensions.bodyFontSize * 0.55,
        lineHeight: 25,
        maxWidth: dimensions.containerMaxWidth * 0.9,
        marginBottom: dimensions.smallGap,
        fontFamily: 'Barlow_400Regular'
    },
    desktopP: {
        color: '#D0D6F9',
        textAlign: 'left',
        fontSize: dimensions.bodyFontSize * 0.55,
        lineHeight: 25,
        maxWidth: dimensions.screenWidth * 0.35,
        marginBottom: dimensions.smallGap,
        fontFamily: 'Barlow_400Regular'
    },
    exploreContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    exploreRing: {
        position: 'absolute',
        width: dimensions.screenWidth * 0.6,
        height: dimensions.screenWidth * 0.6,
        borderRadius: dimensions.screenWidth * 0.3,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    explore: {
        width: dimensions.screenWidth * 0.6,
        height: dimensions.screenWidth * 0.6,
        borderRadius: dimensions.screenWidth * 0.3,
        backgroundColor: '#FFFFFF',
    },
    desktopExploreRing: {
        position: 'absolute',
        width: dimensions.screenHeight * 0.35,
        height: dimensions.screenHeight * 0.35,
        borderRadius: dimensions.screenHeight * 0.175,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    desktopExplore: {
        width: dimensions.screenHeight * 0.35,
        height: dimensions.screenHeight * 0.35,
        borderRadius: dimensions.screenHeight * 0.175,
        backgroundColor: '#FFFFFF',
    },
    exploreButton: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: dimensions.screenWidth * 0.3,
    },
    desktopExploreButton: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: dimensions.screenHeight * 0.175,
    },
    exploreText: {
        fontSize: dimensions.titleFontSize * 0.8,
        fontFamily: 'Bellefair_400Regular',
        letterSpacing: 2,
        color: '#0B0D17'
    }
});