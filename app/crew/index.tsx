import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSwipe from '../../hooks/useSwipe';
import NavBar from '../../components/NavBar';
import crewData from '../../assets/data.json';

type CrewMember = {
    name: string;
    images: {
        png: string;
        webp: string;
    };
    role: string;
    bio: string;
};

const crewImages = {
    'Douglas Hurley': require('../../assets/images/crew/image-douglas-hurley.png'),
    'Mark Shuttleworth': require('../../assets/images/crew/image-mark-shuttleworth.png'),
    'Victor Glover': require('../../assets/images/crew/image-victor-glover.png'),
    'Anousheh Ansari': require('../../assets/images/crew/image-anousheh-ansari.png'),
};

export default function CrewScreen() {
    const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const slideAnim = useState(new Animated.Value(50))[0];
    const scalePageAnim = useState(new Animated.Value(0.95))[0];
    
    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;
    const isMobile = screenWidth < 768;
    const handleContentSwipe = (direction: 'left' | 'right') => {
        const currentIndex = crew.findIndex(member => member.name === selectedCrew?.name);
        if (direction === 'left' && currentIndex < crew.length - 1) {
            selectCrewMember(crew[currentIndex + 1]);
        } else if (direction === 'right' && currentIndex > 0) {
            selectCrewMember(crew[currentIndex - 1]);
        }
    };

    const swipeHandler = useSwipe('crew', handleContentSwipe);

    const crew = crewData.crew;

    useEffect(() => {
        // Page slide-in animation
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(scalePageAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            })
        ]).start();
    }, [slideAnim, scalePageAnim]);

    useEffect(() => {
        const loadLastCrewMember = async () => {
            try {
                const lastCrewMember = await AsyncStorage.getItem('lastCrewMember');
                if (lastCrewMember) {
                    const member = crew.find(c => c.name === lastCrewMember);
                    if (member) {
                        setSelectedCrew(member);
                    }
                } else {
                    setSelectedCrew(crew[0]);
                }
            } catch (error) {
                console.log('Error loading last crew member:', error);
                setSelectedCrew(crew[0]);
            }
        };
        
        loadLastCrewMember();
        AsyncStorage.setItem('lastScreen', 'Crew');

    }, [crew]);

    const selectCrewMember = async (member: CrewMember) => {
        LayoutAnimation.configureNext({
            duration: 250,
            create: { type: 'easeInEaseOut', property: 'opacity' },
            update: { type: 'easeInEaseOut' }
        });
        setSelectedCrew(member);
        try {
            await AsyncStorage.setItem('lastCrewMember', member.name);
        } catch (error) {
            console.log('Error saving crew member:', error);
        }
    };

    const getBackgroundSource = () => {
        if (isMobile) {
            return require('../../assets/images/crew/background-crew-mobile.jpg');
        } else if (isTablet) {
            return require('../../assets/images/crew/background-crew-tablet.jpg');
        } else {
            return require('../../assets/images/crew/background-crew-desktop.jpg');
        }
    };

    const getCrewImage = (member: CrewMember) => {
        return crewImages[member.name as keyof typeof crewImages];
    };



    return (
        <View style={{ flex: 1, minHeight: Dimensions.get('window').height }} {...swipeHandler}>
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
                                    { scale: scalePageAnim }
                                ] 
                            }
                        ]}
                        contentContainerStyle={[styles.content, isDesktop && styles.desktopContent]}
                    >
                        {isDesktop ? (
                            <Text style={styles.desktopPageTitle}>
                                <Text style={styles.pageNumber}>02</Text>
                                {'  '}MEET YOUR CREW
                            </Text>
                        ) : (
                            <Text style={styles.pageTitle}>
                                <Text style={styles.pageNumber}>02</Text>
                                {'  '}MEET YOUR CREW
                            </Text>
                        )}

                        <View style={[styles.pageContentWrapper, isDesktop && styles.desktopPageContentWrapper]}>
                            {isDesktop ? (
                                <View style={styles.desktopLayout}>
                                    <View style={styles.leftColumn}>
                                        {selectedCrew && (
                                            <View style={styles.leftContentWrapper}>
                                                <View style={styles.desktopTextSection}>
                                                    <View style={[styles.infoContainer, styles.desktopInfoContainer]}>
                                                        <Text style={[styles.role, styles.desktopRole]}>{selectedCrew.role.toUpperCase()}</Text>
                                                        <Text style={[styles.crewName, styles.desktopCrewName]}>{selectedCrew.name.toUpperCase()}</Text>
                                                        <Text style={[styles.crewBio, styles.desktopCrewBio]}>{selectedCrew.bio}</Text>
                                                    </View>
                                                </View>

                                                <View style={[styles.navigationContainer, styles.desktopNavigationContainer]}>
                                                    {crew.map((member, index) => (
                                                        <Pressable
                                                            key={member.name}
                                                            style={[
                                                                styles.dot,
                                                                selectedCrew?.name === member.name && styles.activeDot
                                                            ]}
                                                            onPress={() => selectCrewMember(member)}
                                                        />
                                                    ))}
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.rightColumn}>
                                        {selectedCrew && (
                                            <Image
                                                source={getCrewImage(selectedCrew)}
                                                style={styles.desktopCrewImage}
                                                resizeMode="contain"
                                            />
                                        )}
                                    </View>
                                </View>
                            ) : (
                                selectedCrew ? (
                                    <View style={styles.contentWrapper}>
                                        <View style={styles.topSection}>
                                            <View style={styles.mobileTextSection}>
                                                <View style={styles.infoContainer}>
                                                    <Text style={styles.role}>{selectedCrew.role.toUpperCase()}</Text>
                                                    <Text style={styles.crewName}>{selectedCrew.name.toUpperCase()}</Text>
                                                    <Text style={styles.crewBio}>{selectedCrew.bio}</Text>
                                                </View>
                                            </View>

                                            <View style={[styles.navigationContainer, styles.mobileNavigationContainer]}>
                                                {crew.map((member, index) => (
                                                    <Pressable
                                                        key={member.name}
                                                        style={[
                                                            styles.dot,
                                                            selectedCrew?.name === member.name && styles.activeDot
                                                        ]}
                                                        onPress={() => selectCrewMember(member)}
                                                    />
                                                ))}
                                            </View>
                                        </View>

                                        <View style={styles.imageContainer}>
                                            <Image
                                                source={getCrewImage(selectedCrew)}
                                                style={styles.crewImage}
                                                resizeMode="contain"
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <Text style={styles.placeholder}>Loading crew...</Text>
                                )
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
        flexGrow: 1,
        paddingHorizontal: 24,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    contentWrapper: {
        flex: 1,
        justifyContent: 'space-between'
    },
    topSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    leftContentWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    desktopContent: {
        paddingHorizontal: Dimensions.get('window').width * 0.1,
        alignItems: 'stretch',
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        width: '100%',
        gap: 48
    },
    leftColumn: {
        flex: 1,
        alignItems: 'flex-start',
        flexDirection: 'column',
    },
    rightColumn: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    desktopPageTitle: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 28,
        letterSpacing: 4.7,
        color: '#FFFFFF',
        alignSelf: 'flex-start',
        paddingVertical: 64,
        textAlign: 'left'
    },
    desktopRole: {
        fontSize: 28,
        textAlign: 'left'
    },
    desktopCrewName: {
        fontSize: 52,
        textAlign: 'left'
    },
    desktopCrewBio: {
        textAlign: 'left',
        maxWidth: Dimensions.get('window').width * 0.35,
        fontSize: 18,
        lineHeight: 36,
    },
    desktopCrewImage: {
        width: Math.min(540, Dimensions.get('window').width * 0.4),
        height: Math.max(615, Dimensions.get('window').height * 0.333),
        maxHeight: Dimensions.get('window').height * (2/3),
        marginBottom: 0
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
    pageNumber: {
        fontWeight: '700',
        opacity: 0.5,
        color: '#FFFFFF'
    },
    infoContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    desktopInfoContainer: {
        alignItems: 'flex-start',
        paddingHorizontal: 0
    },
    role: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 8,
        textAlign: 'center'
    },
    crewName: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 28,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center'
    },
    crewBio: {
        fontFamily: 'Barlow_400Regular',
        fontSize: 16,
        lineHeight: 30,
        color: '#D0D6F9',
        textAlign: 'center',
        maxWidth: Dimensions.get('window').width * 0.8,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
        marginBottom: 24 * 0.8
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.17)'
    },
    activeDot: {
        backgroundColor: '#FFFFFF'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 350
    },
    crewImage: {
        width: Math.max(270, Math.min(Dimensions.get('window').width * 0.75, 327)),
        height: Math.max(340, Dimensions.get('window').height * 0.333),
    },
    placeholder: {
        fontFamily: 'Barlow_400Regular',
        fontSize: 15,
        color: '#D0D6F9',
        textAlign: 'center',
        marginTop: 24
    },
    desktopTextSection: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    mobileTextSection: {
        flex: 1,
        justifyContent: 'center'
    },
    desktopNavigationContainer: {
        justifyContent: 'flex-start',
        alignSelf: 'flex-start'
    },
    mobileNavigationContainer: {
        alignSelf: 'center'
    },
    pageContentWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    desktopPageContentWrapper: {
        alignItems: 'stretch',
        justifyContent: 'space-between'
    }
});