import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import useSwipe from '@/hooks/useSwipe';
import useDimensions from '@/hooks/useDimensions';
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
    const dimensions = useDimensions();
    const fadeAnim = useState(new Animated.Value(0))[0];
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
        // Page fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

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
                    // Default to first crew member if none saved
                    setSelectedCrew(crew[0]);
                }
            } catch (error) {
                console.log('Error loading last crew member:', error);
                // Fallback to first crew member on error
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
        if (dimensions.isMobile) {
            return require('../../assets/images/crew/background-crew-mobile.jpg');
        } else if (dimensions.isTablet) {
            return require('../../assets/images/crew/background-crew-tablet.jpg');
        } else {
            return require('../../assets/images/crew/background-crew-desktop.jpg');
        }
    };

    const getCrewImage = (member: CrewMember) => {
        return crewImages[member.name as keyof typeof crewImages];
    };


    const styles = createStyles(dimensions);

    return (
        <Animated.View style={{ flex: 1, minHeight: Dimensions.get('window').height, opacity: fadeAnim }} {...swipeHandler}>
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
                            <Text style={styles.pageNumber}>02</Text>
                            {'  '}MEET YOUR CREW
                        </Text>

                        {dimensions.isDesktop ? (
                            <View style={styles.desktopLayout}>
                                <View style={styles.leftColumn}>
                                    {selectedCrew && (
                                        <>
                                            <View style={styles.navigationContainer}>
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

                                            <View style={styles.infoContainer}>
                                                <Text style={[styles.role, styles.desktopRole]}>{selectedCrew.role.toUpperCase()}</Text>
                                                <Text style={[styles.crewName, styles.desktopCrewName]}>{selectedCrew.name.toUpperCase()}</Text>
                                                <Text style={[styles.crewBio, styles.desktopCrewBio]}>{selectedCrew.bio}</Text>
                                            </View>
                                        </>
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
                                <>
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.role}>{selectedCrew.role.toUpperCase()}</Text>
                                        <Text style={styles.crewName}>{selectedCrew.name.toUpperCase()}</Text>
                                        <Text style={styles.crewBio}>{selectedCrew.bio}</Text>
                                    </View>

                                    <View style={styles.navigationContainer}>
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

                                    <View style={styles.imageContainer}>
                                        <Image
                                            source={getCrewImage(selectedCrew)}
                                            style={styles.crewImage}
                                            resizeMode="contain"
                                        />
                                    </View>
                                </>
                            ) : (
                                <Text style={styles.placeholder}>Loading crew...</Text>
                            )
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
        paddingTop: dimensions.paddingVertical * 3
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: dimensions.paddingHorizontal
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
        alignItems: 'flex-start'
    },
    rightColumn: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    desktopPageTitle: {
        alignSelf: 'flex-start',
        marginBottom: dimensions.mediumGap
    },
    desktopRole: {
        fontSize: dimensions.titleFontSize * 0.8,
        textAlign: 'left'
    },
    desktopCrewName: {
        fontSize: dimensions.titleFontSize * 1.4,
        textAlign: 'left'
    },
    desktopCrewBio: {
        textAlign: 'left',
        maxWidth: dimensions.screenWidth * 0.35
    },
    desktopCrewImage: {
        width: dimensions.imageWidth,
        height: dimensions.imageMaxHeight,
        marginBottom: 0
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
    infoContainer: {
        alignItems: 'center',
        paddingHorizontal: dimensions.paddingHorizontal,
        marginBottom: dimensions.smallGap
    },
    role: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: dimensions.bodyFontSize * 0.7,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 8,
        textAlign: 'center'
    },
    crewName: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: dimensions.titleFontSize * 0.6,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center'
    },
    crewBio: {
        fontFamily: 'Barlow_400Regular',
        fontSize: dimensions.bodyFontSize * 0.6,
        lineHeight: 30,
        color: '#D0D6F9',
        textAlign: 'center',
        maxWidth: dimensions.containerMaxWidth * 0.8
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: dimensions.smallGap * 0.4,
        marginBottom: dimensions.smallGap * 0.8
    },
    dot: {
        width: dimensions.dotSize * 0.7,
        height: dimensions.dotSize * 0.7,
        borderRadius: dimensions.dotSize * 0.35,
        backgroundColor: 'rgba(255, 255, 255, 0.17)'
    },
    activeDot: {
        backgroundColor: '#FFFFFF'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: dimensions.mobileImageHeight * 0.6
    },
    crewImage: {
        width: dimensions.mobileImageWidth * 0.75,
        height: dimensions.mobileImageHeight,
        maxHeight: dimensions.imageMaxHeight
    },
    placeholder: {
        fontFamily: 'Barlow_400Regular',
        fontSize: dimensions.bodyFontSize * 0.6,
        color: '#D0D6F9',
        textAlign: 'center',
        marginTop: dimensions.smallGap
    },
});