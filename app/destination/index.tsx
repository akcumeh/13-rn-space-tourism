import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [buttonOpacity] = useState(new Animated.Value(0));

    const destinations = destinationData.destinations;

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

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

        Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [destinations, buttonOpacity]);

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
        if (screenWidth < 640) {
            return require('../../assets/images/destination/background-destination-mobile.jpg');
        } else if (screenWidth < 960) {
            return require('../../assets/images/destination/background-destination-tablet.jpg');
        } else {
            return require('../../assets/images/destination/background-destination-desktop.jpg');
        }
    };

    const navigateToNext = () => {
        router.push('/crew');
    };

    const isDesktop = screenWidth >= 960;

    return (
        <ImageBackground
            source={getBackgroundSource()}
            style={styles.bg}
            resizeMode="cover"
        >
            <NavBar />
            <ScrollView 
                style={styles.container} 
                contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
            >
                <Text style={[styles.pageTitle, isDesktop && styles.desktopPageTitle]}>
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
                                    <View style={styles.statsContainer}>
                                        <View style={styles.stat}>
                                            <Text style={styles.statLabel}>AVG. DISTANCE</Text>
                                            <Text style={styles.statValue}>{selectedDestination.distance.toUpperCase()}</Text>
                                        </View>
                                        <View style={styles.stat}>
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
                                    <View style={styles.stat}>
                                        <Text style={styles.statLabel}>AVG. DISTANCE</Text>
                                        <Text style={styles.statValue}>{selectedDestination.distance.toUpperCase()}</Text>
                                    </View>
                                    <View style={styles.stat}>
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

            {selectedDestination && (
                <Animated.View style={[styles.navigationButton, { opacity: buttonOpacity }]}>
                    <Pressable style={styles.navButton} onPress={navigateToNext}>
                        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                    </Pressable>
                </Animated.View>
            )}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: '#0B0D17'
    },
    container: {
        flex: 1,
        paddingTop: 120
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 50
    },
    desktopContent: {
        paddingHorizontal: 80,
        paddingTop: 200,
        alignItems: 'stretch'
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        gap: 80
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
        alignSelf: 'flex-start',
        marginBottom: 60
    },
    desktopPlanetImage: {
        width: 400,
        height: 400,
        marginBottom: 0
    },
    desktopPlanetName: {
        fontSize: 100,
        textAlign: 'left'
    },
    desktopDescription: {
        textAlign: 'left',
        maxWidth: 400
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
    planetImage: {
        width: 170,
        height: 170,
        marginBottom: 26
    },
    planetPlaceholder: {
        width: 170,
        height: 170,
        marginBottom: 26
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 26
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
        fontSize: 14,
        letterSpacing: 2.36,
        color: '#D0D6F9'
    },
    tabTextActive: {
        color: '#FFFFFF'
    },
    infoContainer: {
        alignItems: 'center',
        maxWidth: 400
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
        marginBottom: 32
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        marginBottom: 32
    },
    statsContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 32
    },
    stat: {
        alignItems: 'center'
    },
    statLabel: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 14,
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
        marginTop: 40
    },
    navigationButton: {
        position: 'absolute',
        bottom: 50,
        right: 24,
        zIndex: 10,
    },
    navButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});