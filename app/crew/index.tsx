import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
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
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [buttonOpacity] = useState(new Animated.Value(0));

    const crew = crewData.crew;

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

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

        Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [crew, buttonOpacity]);

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
        if (screenWidth < 640) {
            return require('../../assets/images/crew/background-crew-mobile.jpg');
        } else if (screenWidth < 960) {
            return require('../../assets/images/crew/background-crew-tablet.jpg');
        } else {
            return require('../../assets/images/crew/background-crew-desktop.jpg');
        }
    };

    const getCrewImage = (member: CrewMember) => {
        return crewImages[member.name as keyof typeof crewImages];
    };

    const navigateToNext = () => {
        router.push('/technology');
    };

    return (
        <ImageBackground
            source={getBackgroundSource()}
            style={styles.bg}
            resizeMode="cover"
        >
            <NavBar />
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <Text style={styles.pageTitle}>
                    <Text style={styles.pageNumber}>02</Text>
                    {'     '}MEET YOUR CREW
                </Text>

                {selectedCrew ? (
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
                )}
            </ScrollView>

            <Animated.View style={[styles.navigationButton, { opacity: buttonOpacity }]}>
                <Pressable style={styles.navButton} onPress={navigateToNext}>
                    <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
                </Pressable>
            </Animated.View>
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
        paddingTop: 96
    },
    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 150
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
    infoContainer: {
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 40
    },
    role: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 8,
        textAlign: 'center'
    },
    crewName: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center'
    },
    crewBio: {
        fontFamily: 'Barlow_400Regular',
        fontSize: 15,
        lineHeight: 25,
        color: '#D0D6F9',
        textAlign: 'center',
        maxWidth: 327
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32
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
        minHeight: 300
    },
    crewImage: {
        width: 300,
        height: 400,
        maxHeight: '100%'
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