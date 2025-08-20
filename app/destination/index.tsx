import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import useSwipe from '@/hooks/useSwipe';
import useDimensions from '@/hooks/useDimensions';
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
    const dimensions = useDimensions();
    const fadeAnim = useState(new Animated.Value(0))[0];
    const swipeHandler = useSwipe('destination');

    const destinations = destinationData.destinations;

    useEffect(() => {
        // Page fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

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
        if (dimensions.isMobile) {
            return require('../../assets/images/destination/background-destination-mobile.jpg');
        } else if (dimensions.isTablet) {
            return require('../../assets/images/destination/background-destination-tablet.jpg');
        } else {
            return require('../../assets/images/destination/background-destination-desktop.jpg');
        }
    };


    const styles = createStyles(dimensions);

    return (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }} {...swipeHandler}>
            <ScrollView>
                <ImageBackground
                    source={getBackgroundSource()}
                    style={styles.bg}
                    resizeMode="cover"
                >
                    <NavBar />
                    <ScrollView
                        style={styles.container}
                        contentContainerStyle={[styles.content, dimensions.isDesktop && styles.desktopContent]}
                    >
                        <Text style={[styles.pageTitle, dimensions.isDesktop && styles.desktopPageTitle]}>
                            <Text style={styles.pageNumber}>01</Text>
                            {'  '}PICK YOUR DESTINATION
                        </Text>

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
                                            <Text style={[styles.planetName, styles.desktopPlanetName]}>{selectedDestination.name.toUpperCase()}</Text>
                                            <Text style={[styles.planetDescription, styles.desktopDescription]}>{selectedDestination.description}</Text>
                                            <View style={styles.divider} />
                                            <View style={[styles.statsContainer, dimensions.dimensions.isDesktop && styles.desktopStatsContainer]}>
                                                <View style={[styles.stat, dimensions.isDesktop && styles.desktopStat]}>
                                                    <Text style={styles.statLabel}>AVG. DISTANCE</Text>
                                                    <Text style={styles.statValue}>{selectedDestination.distance.toUpperCase()}</Text>
                                                </View>
                                                <View style={[styles.stat, dimensions.isDesktop && styles.desktopStat]}>
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
                        ) : (
                            <>
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
                                        <View style={styles.statsContainer}>
                                            <View style={[styles.stat, dimensions.isDesktop && styles.desktopStat]}>
                                                <Text style={styles.statLabel}>AVG. DISTANCE</Text>
                                                <Text style={styles.statValue}>{selectedDestination.distance.toUpperCase()}</Text>
                                            </View>
                                            <View style={[styles.stat, dimensions.isDesktop && styles.desktopStat]}>
                                                <Text style={styles.statLabel}>EST. TRAVEL TIME</Text>
                                                <Text style={styles.statValue}>{selectedDestination.travel.toUpperCase()}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <Text style={styles.placeholder}>Choose a planet to learn more</Text>
                                )}
                            </>
                        )}
                    </ScrollView>

                </ImageBackground>
            </ScrollView>
        </Animated.View>
    );
}

const createStyles = (dimensions) => StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: '#0B0D17',
        minHeight: dimensions.screenHeight
    },
    container: {
        flex: 1,
        paddingTop: dimensions.paddingVertical * 4
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: dimensions.paddingHorizontal,
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
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        gap: dimensions.largeGap
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
        fontSize: dimensions.titleFontSize * 0.7,
        letterSpacing: 4.7,
        color: '#FFFFFF',
        alignSelf: 'flex-start',
        marginBottom: dimensions.mediumGap
    },
    desktopPlanetImage: {
        width: dimensions.imageWidth,
        height: dimensions.imageMaxHeight * 0.57,
        marginBottom: 0
    },
    desktopPlanetName: {
        fontSize: dimensions.titleFontSize * 2.5,
        textAlign: 'left'
    },
    desktopDescription: {
        textAlign: 'left',
        maxWidth: dimensions.screenWidth * 0.32
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
    pageNumber: {
        fontWeight: 'bold',
        opacity: 0.5
    },
    planetImage: {
        width: dimensions.mobileImageWidth * 0.4,
        height: dimensions.mobileImageWidth * 0.4,
        marginBottom: dimensions.smallGap * 0.65
    },
    planetPlaceholder: {
        width: dimensions.mobileImageWidth * 0.4,
        height: dimensions.mobileImageWidth * 0.4,
        marginBottom: dimensions.smallGap * 0.65
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: dimensions.smallGap * 0.5,
        gap: dimensions.smallGap * 0.65
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
        fontSize: dimensions.bodyFontSize * 0.55,
        letterSpacing: 2.36,
        color: '#D0D6F9'
    },
    tabTextActive: {
        color: '#FFFFFF'
    },
    infoContainer: {
        alignItems: 'center',
        maxWidth: dimensions.containerMaxWidth * 0.8
    },
    planetName: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: dimensions.titleFontSize * 1.4,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center'
    },
    planetDescription: {
        fontFamily: 'Barlow_400Regular',
        fontSize: dimensions.bodyFontSize * 0.55,
        lineHeight: 25,
        color: '#D0D6F9',
        textAlign: 'center',
        marginBottom: dimensions.smallGap * 0.8
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        marginBottom: dimensions.smallGap * 0.8
    },
    statsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: dimensions.smallGap * 0.8
    },
    desktopStatsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: dimensions.smallGap * 0.8,
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
        fontSize: dimensions.bodyFontSize * 0.55,
        letterSpacing: 2.36,
        color: '#D0D6F9',
        marginBottom: 12
    },
    statValue: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: dimensions.titleFontSize * 0.7,
        color: '#FFFFFF'
    },
    placeholder: {
        fontFamily: 'Barlow_400Regular',
        fontSize: dimensions.bodyFontSize * 0.6,
        color: '#D0D6F9',
        textAlign: 'center',
        marginTop: dimensions.smallGap
    },
});