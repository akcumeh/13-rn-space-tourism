import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import useSwipe from '@/hooks/useSwipe';
import useDimensions from '@/hooks/useDimensions';
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
    const dimensions = useDimensions();
    const fadeAnim = useState(new Animated.Value(0))[0];
    const handleContentSwipe = (direction: 'left' | 'right') => {
        const currentIndex = technologies.findIndex(tech => tech.name === selectedTechnology?.name);
        if (direction === 'left' && currentIndex < technologies.length - 1) {
            selectTechnology(technologies[currentIndex + 1]);
        } else if (direction === 'right' && currentIndex > 0) {
            selectTechnology(technologies[currentIndex - 1]);
        }
    };

    const swipeHandler = useSwipe('technology', handleContentSwipe);

    const technologies = technologyData.technology;

    useEffect(() => {
        // Page fade-in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

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

    }, [technologies]);

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
        if (dimensions.isMobile) {
            return require('../../assets/images/technology/background-technology-mobile.jpg');
        } else if (dimensions.isTablet) {
            return require('../../assets/images/technology/background-technology-tablet.jpg');
        } else {
            return require('../../assets/images/technology/background-technology-desktop.jpg');
        }
    };

    const getTechnologyImage = (technology: Technology) => {
        const imageSet = technologyImages[technology.name as keyof typeof technologyImages];
        // Use portrait for larger screens, landscape for smaller
        return dimensions.isDesktop ? imageSet.portrait : imageSet.landscape;
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
                            <Text style={styles.pageNumber}>03</Text>
                            {'     '}SPACE LAUNCH 101
                        </Text>

                        {dimensions.isDesktop ? (
                            <View style={styles.desktopLayout}>
                                <View style={[styles.navigationContainer, dimensions.isDesktop && styles.desktopNavigationContainer]}>
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

                                <View style={styles.leftColumn}>
                                    {selectedTechnology && (
                                        <View style={styles.infoContainer}>
                                            <Text style={[styles.terminology, styles.desktopTerminology]}>THE TERMINOLOGY...</Text>
                                            <Text style={[styles.technologyName, styles.desktopTechnologyName]}>{selectedTechnology.name.toUpperCase()}</Text>
                                            <Text style={[styles.technologyDescription, styles.desktopDescription]}>{selectedTechnology.description}</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.rightColumn}>
                                    {selectedTechnology && (
                                        <Image
                                            source={getTechnologyImage(selectedTechnology)}
                                            style={styles.desktopTechnologyImage}
                                            resizeMode="contain"
                                        />
                                    )}
                                </View>
                            </View>
                        ) : (
                            <>
                                <View style={[styles.navigationContainer, dimensions.isDesktop && styles.desktopNavigationContainer]}>
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
        paddingTop: dimensions.paddingVertical * 3
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
        alignItems: 'flex-start'
    },
    rightColumn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    desktopPageTitle: {
        alignSelf: 'flex-start',
        marginBottom: dimensions.mediumGap
    },
    desktopTerminology: {
        textAlign: 'left'
    },
    desktopTechnologyName: {
        fontSize: dimensions.titleFontSize * 1.4,
        textAlign: 'left'
    },
    desktopDescription: {
        textAlign: 'left',
        maxWidth: dimensions.screenWidth * 0.35
    },
    desktopTechnologyImage: {
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
    navigationContainer: {
        flexDirection: 'row',
        gap: dimensions.smallGap * 0.4,
        marginBottom: dimensions.smallGap * 0.8,
        alignItems: 'center'
    },
    desktopNavigationContainer: {
        flexDirection: 'column',
        gap: dimensions.smallGap * 0.8,
        marginBottom: 0,
        marginRight: dimensions.largeGap,
        alignItems: 'flex-start'
    },
    navNumber: {
        width: dimensions.navButtonSize,
        height: dimensions.navButtonSize,
        borderRadius: dimensions.navButtonSize / 2,
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
        fontSize: dimensions.bodyFontSize * 0.6,
        color: '#FFFFFF'
    },
    navNumberTextActive: {
        color: '#0B0D17'
    },
    technologyImage: {
        width: dimensions.mobileImageWidth,
        height: dimensions.mobileImageHeight * 0.34,
        marginBottom: dimensions.smallGap * 0.85
    },
    infoContainer: {
        alignItems: 'center',
        maxWidth: dimensions.containerMaxWidth * 0.8
    },
    terminology: {
        fontFamily: 'BarlowCondensed_400Regular',
        fontSize: dimensions.bodyFontSize * 0.55,
        letterSpacing: 2.36,
        color: '#D0D6F9',
        marginBottom: 9
    },
    technologyName: {
        fontFamily: 'Bellefair_400Regular',
        fontSize: dimensions.titleFontSize * 0.6,
        color: '#FFFFFF',
        marginBottom: 16,
        textAlign: 'center'
    },
    technologyDescription: {
        fontFamily: 'Barlow_400Regular',
        fontSize: dimensions.bodyFontSize * 0.55,
        lineHeight: 25,
        color: '#D0D6F9',
        textAlign: 'center'
    },
    placeholder: {
        fontFamily: 'Barlow_400Regular',
        fontSize: dimensions.bodyFontSize * 0.6,
        color: '#D0D6F9',
        textAlign: 'center',
        marginTop: dimensions.smallGap
    },
});