import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import NavBar from '../../components/NavBar';
import technologyData from '../../assets/data.json';

type Technology = {
    name: string;
    images: {
        portrait: string;
        landscape: string;
    };
    description: string;
};

const technologyImages = {
    'Launch vehicle': {
        portrait: require('../../assets/images/technology/image-launch-vehicle-portrait.jpg'),
        landscape: require('../../assets/images/technology/image-launch-vehicle-landscape.jpg'),
    },
    'Spaceport': {
        portrait: require('../../assets/images/technology/image-spaceport-portrait.jpg'),
        landscape: require('../../assets/images/technology/image-spaceport-landscape.jpg'),
    },
    'Space capsule': {
        portrait: require('../../assets/images/technology/image-space-capsule-portrait.jpg'),
        landscape: require('../../assets/images/technology/image-space-capsule-landscape.jpg'),
    },
};

export default function TechnologyScreen() {
    const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [buttonOpacity] = useState(new Animated.Value(0));

    const technologies = technologyData.technology;

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    useEffect(() => {
        const loadLastTechnology = async () => {
            try {
                const lastTechnology = await AsyncStorage.getItem('lastTechnology');
                if (lastTechnology) {
                    const technology = technologies.find(t => t.name === lastTechnology);
                    if (technology) {
                        setSelectedTechnology(technology);
                    }
                } else {
                    // Default to first technology if none saved
                    setSelectedTechnology(technologies[0]);
                }
            } catch (error) {
                console.log('Error loading last technology:', error);
                // Fallback to first technology on error
                setSelectedTechnology(technologies[0]);
            }
        };
        loadLastTechnology();

        Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [technologies, buttonOpacity]);

    const selectTechnology = async (technology: Technology) => {
        LayoutAnimation.configureNext({
            duration: 250,
            create: { type: 'easeInEaseOut', property: 'opacity' },
            update: { type: 'easeInEaseOut' }
        });
        setSelectedTechnology(technology);
        try {
            await AsyncStorage.setItem('lastTechnology', technology.name);
        } catch (error) {
            console.log('Error saving technology:', error);
        }
    };

    const getBackgroundSource = () => {
        if (screenWidth < 640) {
            return require('../../assets/images/technology/background-technology-mobile.jpg');
        } else if (screenWidth < 960) {
            return require('../../assets/images/technology/background-technology-tablet.jpg');
        } else {
            return require('../../assets/images/technology/background-technology-desktop.jpg');
        }
    };

    const getTechnologyImage = (technology: Technology) => {
        const imageSet = technologyImages[technology.name as keyof typeof technologyImages];
        // Use portrait for larger screens, landscape for smaller
        return screenWidth >= 960 ? imageSet.portrait : imageSet.landscape;
    };

    const navigateToNext = () => {
        router.push('/home');
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
                    <Text style={styles.pageNumber}>03</Text>
                    {'     '}SPACE LAUNCH 101
                </Text>

                <View style={styles.navigationContainer}>
                    {technologies.map((technology, index) => (
                        <Pressable
                            key={technology.name}
                            style={[
                                styles.navNumber,
                                selectedTechnology?.name === technology.name && styles.navNumberActive
                            ]}
                            onPress={() => selectTechnology(technology)}
                        >
                            <Text style={[
                                styles.navNumberText,
                                selectedTechnology?.name === technology.name && styles.navNumberTextActive
                            ]}>
                                {index + 1}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {selectedTechnology ? (
                    <>
                        <Image
                            source={getTechnologyImage(selectedTechnology)}
                            style={styles.technologyImage}
                            resizeMode="contain"
                        />

                        <View style={styles.infoContainer}>
                            <Text style={styles.terminology}>THE TERMINOLOGY...</Text>
                            <Text style={styles.technologyName}>{selectedTechnology.name.toUpperCase()}</Text>
                            <Text style={styles.technologyDescription}>{selectedTechnology.description}</Text>
                        </View>
                    </>
                ) : (
                    <Text style={styles.placeholder}>Loading technology...</Text>
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
        alignItems: 'center',
        paddingHorizontal: 24,
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
    navigationContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32
    },
    navNumber: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    navNumberActive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#FFFFFF'
    },
    navNumberText: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 16,
        color: '#FFFFFF'
    },
    navNumberTextActive: {
        color: '#0B0D17'
    },
    technologyImage: {
        width: '100%',
        height: 170,
        marginBottom: 34
    },
    infoContainer: {
        alignItems: 'center',
        maxWidth: 400
    },
    terminology: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: 14,
        letterSpacing: 2.36,
        color: '#D0D6F9',
        marginBottom: 9
    },
    technologyName: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: 24,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center'
    },
    technologyDescription: {
        fontFamily: 'Barlow_400Regular',
        fontSize: 15,
        lineHeight: 25,
        color: '#D0D6F9',
        textAlign: 'center'
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