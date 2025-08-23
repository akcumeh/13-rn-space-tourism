import { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Pressable, StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import { router } from 'expo-router';
import NavBar from '../../components/NavBar';
import useSwipe from '../../hooks/useSwipe';

export default function HomeScreen() {
    const [isPressed, setIsPressed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const scaleAnim = useState(new Animated.Value(1))[0];
    const ringAnim = useState(new Animated.Value(0))[0];
    const slideAnim = useState(new Animated.Value(50))[0];
    const pageScaleAnim = useState(new Animated.Value(0.95))[0];
    const swipeHandler = useSwipe('home');
    
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;
    const isMobile = screenWidth < 768;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(pageScaleAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, [slideAnim, pageScaleAnim]);

    const handlePressIn = () => {
        setIsPressed(true);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.975,
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
        if (isDesktop) {
            setIsHovered(true);
            Animated.timing(ringAnim, {
                toValue: 0.7,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleHoverOut = () => {
        if (isDesktop) {
            setIsHovered(false);
            Animated.timing(ringAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const getBg = () => {
        if (isMobile) {
            return require('../../assets/images/home/background-home-mobile.jpg');
        } else if (isTablet) {
            return require('../../assets/images/home/background-home-tablet.jpg');
        } else {
            return require('../../assets/images/home/background-home-desktop.jpg');
        }
    };


    return (
        <View style={[styles.container, isDesktop && styles.desktopContainer]} {...swipeHandler}>
            <ImageBackground
                source={getBg()}
                style={[styles.bg, isDesktop && styles.desktopBg]}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={{ minHeight: screenHeight }}>
                    <NavBar />
                    <Animated.ScrollView
                        style={[
                            styles.scrollContainer, 
                            { 
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: pageScaleAnim }
                                ] 
                            }
                        ]}
                        contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={[styles.pageContentWrapper, isDesktop && styles.desktopPageContentWrapper]}>
                            {isDesktop ? (
                                <View style={styles.desktopLayout}>
                                    <View style={styles.leftColumn}>
                                        <View style={styles.desktopTextContentWrapper}>
                                            <Text style={[styles.h3, styles.desktopH3]}>SO, YOU WANT TO TRAVEL TO</Text>
                                            <Text style={[styles.h1, styles.desktopH1]}>SPACE</Text>
                                            <Text style={[styles.p, styles.desktopP]}>
                                                Let&apos;s face it; if you want to go to space, you might as well genuinely go to
                                                outer space and not hover kind of on the edge of it. Well sit back, and relax
                                                because we&apos;ll give you a truly out of this world experience!
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.rightColumn}>
                                        <View style={styles.exploreContainer}>
                                            <Animated.View
                                                style={[
                                                    isDesktop ? styles.desktopExploreRing : styles.exploreRing,
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
                                                    isDesktop ? styles.desktopExplore : styles.explore,
                                                    {
                                                        transform: [{ scale: scaleAnim }]
                                                    }
                                                ]}
                                            >
                                                <Pressable
                                                    style={isDesktop ? styles.desktopExploreButton : styles.exploreButton}
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
                                <View style={styles.contentWrapper}>
                                    <View style={styles.textContentWrapper}>
                                        <Text style={styles.h3}>SO, YOU WANT TO TRAVEL TO</Text>
                                        <Text style={styles.h1}>SPACE</Text>
                                        <Text style={styles.p}>
                                            Let&apos;s face it; if you want to go to space, you might as well genuinely go to
                                            outer space and not hover kind of on the edge of it. Well sit back, and relax
                                            because we&apos;ll give you a truly out of this world experience!
                                        </Text>
                                    </View>
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
                            )}
                        </View>
                    </Animated.ScrollView>
                </ScrollView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: '#0B0D17',
        height: Dimensions.get('window').height,
        width: '100%',
        resizeMode: 'cover'
    },
    container: {
        flex: 1,
        height: Dimensions.get('window').height,
    },
    desktopContainer: {
        alignItems: 'center',
        backgroundColor: '#0B0D17'
    },
    desktopBg: {
        resizeMode: 'cover',
        width: Dimensions.get('window').width
    },
    scrollContainer: {
        flex: 1,
    },
    content: {
        minHeight: Dimensions.get('window').height * 0.8,
        paddingVertical: Dimensions.get('window').height * 0.125,
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    desktopContent: {
        paddingHorizontal: Dimensions.get('window').width * 0.1,
        alignItems: 'stretch'
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'baseline',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: Dimensions.get('window').width * 0.05,
        marginTop: Dimensions.get('window').height * 0.1,
        minHeight: Dimensions.get('window').height * 0.65,
    },
    leftColumn: {
        flex: 1,
        alignItems: 'flex-start',
        paddingRight: 24,
        paddingBottom: 32
    },
    rightColumn: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 32
    },
    // pageTitle: {
    //     fontFamily: 'BarlowCondensed_400Regular',
    //     fontSize: 16,
    //     letterSpacing: 2.7,
    //     color: '#FFFFFF',
    //     paddingVertical: 16,
    //     marginBottom: 24,
    //     textAlign: 'center'
    // },
    // desktopPageTitle: {
    //     fontFamily: 'BarlowCondensed_400Regular',
    //     fontSize: 28,
    //     letterSpacing: 4.7,
    //     color: '#FFFFFF',
    //     paddingVertical: 32,
    //     marginBottom: 40,
    //     textAlign: 'left'
    // },
    contentWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textContentWrapper: {
        alignItems: 'center'
    },
    // pageNumber: {
    //     fontWeight: '700',
    //     opacity: 0.5,
    //     color: '#FFFFFF'
    // },
    h3: {
        color: '#D0D6F9',
        letterSpacing: 3,
        fontSize: 16,
        marginVertical: 12,
        fontFamily: 'BarlowCondensed_400Regular'
    },
    h1: {
        color: '#FFFFFF',
        fontSize: 80,
        lineHeight: 100,
        marginVertical: 16,
        fontFamily: 'Bellefair_400Regular'
    },
    p: {
        color: '#D0D6F9',
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 25,
        maxWidth: Dimensions.get('window').width < 768 ? Dimensions.get('window').width * 0.75 : 500,
        
        fontFamily: 'Barlow_400Regular'
    },
    desktopP: {
        color: '#D0D6F9',
        textAlign: 'left',
        fontSize: 18,
        lineHeight: 32,
        maxWidth: 450,
        
        fontFamily: 'Barlow_400Regular'
    },
    exploreContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 48
    },
    exploreRing: {
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    explore: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#FFFFFF',
    },
    desktopExploreRing: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 225,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    desktopExplore: {
        width: 275,
        height: 275,
        borderRadius: 137,
        backgroundColor: '#FFFFFF',
    },
    exploreButton: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 75,
    },
    desktopExploreButton: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    exploreText: {
        fontSize: 21,
        fontFamily: 'Bellefair_400Regular',
        letterSpacing: 2,
        color: '#0B0D17'
    },
    desktopTextContentWrapper: {
        alignItems: 'flex-start'
    },
    desktopH3: {
        textAlign: 'left'
    },
    desktopH1: {
        textAlign: 'left'
    },
    pageContentWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    desktopPageContentWrapper: {
        alignItems: 'stretch',
        justifyContent: 'space-between'
    }
});