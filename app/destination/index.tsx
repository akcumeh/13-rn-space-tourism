import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSwipe from '../../hooks/useSwipe';
import NavBar from '../../components/NavBar';
import destinationData from '../../assets/data.json';

type Destination = {
    name: string;
    images: {
        png: string;
        webp: string;
    };
    description: string;
    distance: string;
    travel: string;
};

const destinationImages = {
    Moon: require('../../assets/images/destination/image-moon.png'),
    Mars: require('../../assets/images/destination/image-mars.png'),
    Europa: require('../../assets/images/destination/image-europa.png'),
    Titan: require('../../assets/images/destination/image-titan.png'),
};

export default function DestinationScreen() {
    const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const slideAnim = useState(new Animated.Value(50))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];
    const swipeHandler = useSwipe('destination');
    
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;
    const isMobile = screenWidth < 768;

    const destinations = destinationData.destinations;

    useEffect(() => {
        // Page slide-in animation
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, [slideAnim, scaleAnim]);

    useEffect(() => {
        const loadLastDestination = async () => {
            try {
                const lastDestination = await AsyncStorage.getItem('lastDestination');
                if (lastDestination) {
                    const destination = destinations.find(d => d.name === lastDestination);
                    if (destination) {
                        setSelectedDestination(destination);
                    }
                } else {
                    setSelectedDestination(destinations[0]);
                }
            } catch (error) {
                console.log('Error loading last destination:', error);
                setSelectedDestination(destinations[0]);
            }
        };
        loadLastDestination();

    }, [destinations]);

    const selectDestination = async (destination: Destination) => {
        LayoutAnimation.configureNext({
            duration: 250,
            create: { type: 'easeInEaseOut', property: 'opacity' },
            update: { type: 'easeInEaseOut' }
        });
        setSelectedDestination(destination);
        try {
            await AsyncStorage.setItem('lastDestination', destination.name);
        } catch (error) {
            console.log('Error saving destination:', error);
        }
    };

    const getBackgroundSource = () => {
        if (isMobile) {
            return require('../../assets/images/destination/background-destination-mobile.jpg');
        } else if (isTablet) {
            return require('../../assets/images/destination/background-destination-tablet.jpg');
        } else {
            return require('../../assets/images/destination/background-destination-desktop.jpg');
        }
    };



    return (
        <View style={{ flex: 1 }} {...swipeHandler}>
            <ImageBackground
                source={getBackgroundSource()}
                style={styles.bg}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={{ minHeight: screenHeight }}>
                    <NavBar />
                    <Animated.ScrollView
                        style={[
                            styles.container, 
                            { 
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ] 
                            }
                        ]}
                        contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
                    >
                        {isDesktop ? (
                            <Text style={styles.desktopPageTitle}>
                                <Text style={styles.pageNumber}>01</Text>
                                {'  '}PICK YOUR DESTINATION
                            </Text>
                        ) : (
                            <Text style={styles.pageTitle}>
                                <Text style={styles.pageNumber}>01</Text>
                                {'  '}PICK YOUR DESTINATION
                            </Text>
                        )}

                        <View style={[styles.pageContentWrapper, isDesktop && styles.desktopPageContentWrapper]}>
                            {isDesktop ? (
                                <View style={styles.desktopLayout}>
                                    <View style={styles.leftColumn}>
                                        {selectedDestination ? (
                                            <Image
                                                source={destinationImages[selectedDestination.name as keyof typeof destinationImages]}
                                                style={styles.desktopPlanetImage}
                                                resizeMode="contain"
                                            />
                                        ) : (
                                            <View style={styles.planetPlaceholder} />
                                        )}
                                    </View>

                                    <View style={styles.rightColumn}>
                                        <View style={[styles.contentContainer, styles.desktopContentContainer]}>
                                            <View style={[styles.tabContainer, styles.desktopTabContainer]}>
                                                {destinations.map((destination) => (
                                                    <Pressable
                                                        key={destination.name}
                                                        style={[
                                                            styles.tab,
                                                            styles.desktopTab,
                                                            selectedDestination?.name === destination.name && styles.tabActive
                                                        ]}
                                                        onPress={() => selectDestination(destination)}
                                                    >
                                                        <Text style={[
                                                            styles.tabText,
                                                            selectedDestination?.name === destination.name && styles.tabTextActive
                                                        ]}>
                                                            {destination.name.toUpperCase()}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </View>

                                            {selectedDestination ? (
                                                <View style={[styles.infoContainer, styles.desktopInfoContainer]}>
                                                    <Text style={[styles.planetName, styles.desktopPlanetName]}>{selectedDestination.name.toUpperCase()}</Text>
                                                    <Text style={[styles.planetDescription, styles.desktopDescription]}>{selectedDestination.description}</Text>
                                                    <View style={styles.divider} />
                                                    <View style={[styles.statsContainer, isDesktop && styles.desktopStatsContainer]}>
                                                        <View style={[styles.stat, isDesktop && styles.desktopStat]}>
                                                            <Text style={styles.statLabel}>AVG. DISTANCE</Text>
                                                            <Text style={styles.statValue}>{selectedDestination.distance.toUpperCase()}</Text>
                                                        </View>
                                                        <View style={[styles.stat, isDesktop && styles.desktopStat]}>
                                                            <Text style={styles.statLabel}>EST. TRAVEL TIME</Text>
                                                            <Text style={styles.statValue}>{selectedDestination.travel.toUpperCase()}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            ) : (
                                                <Text style={styles.placeholder}>Choose a planet to learn more</Text>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.contentContainer}>
                                    {selectedDestination ? (
                                        <Image
                                            source={destinationImages[selectedDestination.name as keyof typeof destinationImages]}
                                            style={styles.planetImage}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <View style={styles.planetPlaceholder} />
                                    )}

                                    <View style={styles.tabContainer}>
                                        {destinations.map((destination) => (
                                            <Pressable
                                                key={destination.name}
                                                style={[
                                                    styles.tab,
                                                    selectedDestination?.name === destination.name && styles.tabActive
                                                ]}
                                                onPress={() => selectDestination(destination)}
                                            >
                                                <Text style={[
                                                    styles.tabText,
                                                    selectedDestination?.name === destination.name && styles.tabTextActive
                                                ]}>
                                                    {destination.name.toUpperCase()}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>

                                    {selectedDestination ? (
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.planetName}>{selectedDestination.name.toUpperCase()}</Text>
                                            <Text style={styles.planetDescription}>{selectedDestination.description}</Text>
                                            <View style={styles.divider} />
                                            <View style={[styles.statsContainer, isTablet && styles.tabletStatsContainer]}>
                                                <View style={[styles.stat, isDesktop && styles.desktopStat]}>
                                                    <Text style={styles.statLabel}>AVG. DISTANCE</Text>
                                                    <Text style={styles.statValue}>{selectedDestination.distance.toUpperCase()}</Text>
                                                </View>
                                                <View style={[styles.stat, isDesktop && styles.desktopStat]}>
                                                    <Text style={styles.statLabel}>EST. TRAVEL TIME</Text>
                                                    <Text style={styles.statValue}>{selectedDestination.travel.toUpperCase()}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={styles.placeholder}>Choose a planet to learn more</Text>
                                    )}
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
        paddingTop: 100
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 32
    },
    desktopContent: {
        paddingHorizontal: Dimensions.get('window').width * 0.1,
        alignItems: 'stretch'
    },
    desktopLayout: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 96
    },
    leftColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-start'
    },
    desktopPageTitle: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 28,
        letterSpacing: 4.7,
        color: '#FFFFFF',
        alignSelf: 'flex-start',
        paddingVertical: 64,
        marginBottom: 40,
        textAlign: 'left'
    },
    desktopPlanetImage: {
        width: 445,
        height: 445,
    },
    desktopPlanetName: {
        fontSize: 90,
        textAlign: 'left'
    },
    desktopDescription: {
        textAlign: 'left',
        width: Dimensions.get('window').width * 0.25
    },
    pageTitle: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 16,
        letterSpacing: 2.7,
        color: '#FFFFFF',
        paddingVertical: 16,
        marginBottom: 24,
        textAlign: 'center'
    },
    contentContainer: {
        alignItems: 'center',
        flex: 1
    },
    desktopContentContainer: {
        alignItems: 'flex-start',
        width: '100%'
    },
    tabletStatsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 48
    },
    pageNumber: {
        fontWeight: '700',
        opacity: 0.5,
        color: '#FFFFFF'
    },
    planetImage: {
        width: 170,
        height: 170,
        marginBottom: 24 * 0.65
    },
    planetPlaceholder: {
        width: 170,
        height: 170,
        marginBottom: 24 * 0.65
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 24 * 0.5,
        gap: 24 * 0.65
    },
    desktopTabContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        width: '100%'
    },
    desktopTab: {
        marginHorizontal: 8,
    },
    tab: {
        paddingVertical: 8,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent'
    },
    tabActive: {
        borderBottomColor: '#FFFFFF'
    },
    tabText: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 15,
        letterSpacing: 2.36,
        color: '#D0D6F9'
    },
    tabTextActive: {
        color: '#FFFFFF'
    },
    infoContainer: {
        alignItems: 'center',
        maxWidth: 327
    },
    desktopInfoContainer: {
        alignItems: 'flex-start',
        marginHorizontal: 8
    },
    planetName: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 56,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center'
    },
    planetDescription: {
        fontFamily: 'Barlow_400Regular',
        fontSize: 15,
        lineHeight: 25,
        color: '#D0D6F9',
        textAlign: 'center',
        marginBottom: 24 * 0.8
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        marginBottom: 24 * 0.8
    },
    statsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 24 * 0.8
    },
    desktopStatsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 24 * 0.8,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    stat: {
        alignItems: 'center'
    },
    desktopStat: {
        alignItems: 'flex-start',
        flex: 1
    },
    statLabel: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 15,
        letterSpacing: 2.36,
        color: '#D0D6F9',
        marginBottom: 12
    },
    statValue: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 28,
        color: '#FFFFFF'
    },
    placeholder: {
        fontFamily: 'Barlow_400Regular',
        fontSize: 16,
        color: '#D0D6F9',
        textAlign: 'center',
        marginTop: 24
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