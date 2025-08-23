import { useEffect, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, LayoutAnimation, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useSwipe from '../../hooks/useSwipe';
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
    const [screenDimensions, setScreenDimensions] = useState(() => Dimensions.get('window'));
    const slideAnim = useState(new Animated.Value(50))[0];
    const scaleAnim = useState(new Animated.Value(0.95))[0];
    
    const { width: screenWidth, height: screenHeight } = screenDimensions;
    
    const getStyles = () => StyleSheet.create({
        container: {
            flex: 1,
            minHeight: '100%',
        },
        bg: {
            backgroundColor: '#0B0D17',
            minHeight: '100%',
            width: '100%',
        },
        scrollContainer: {
            flex: 1,
            paddingTop: 100
        },
        content: {
            alignItems: 'center',
            paddingBottom: 32,
        },
        desktopContent: {
            paddingHorizontal: screenWidth * 0.1,
            alignItems: 'stretch'
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
        desktopPageTitle: {
            fontFamily: 'BarlowCondensed_400Regular',
            fontSize: 28,
            letterSpacing: 4.7,
            color: '#FFFFFF',
            alignSelf: 'flex-start',
            paddingVertical: 64,
            textAlign: 'left'
        },
        pageNumber: {
            fontWeight: '700',
            opacity: 0.5,
            color: '#FFFFFF'
        },
        pageContentWrapper: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        desktopPageContentWrapper: {
            alignItems: 'stretch',
            justifyContent: 'space-between'
        },
        desktopLayout: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            gap: 96
        },
        leftColumn: {
            flex: 1,
            alignItems: 'flex-start',
            justifyContent: 'flex-start'
        },
        rightColumn: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        mobileContentWrapper: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        mobileContentLayout: {
            flex: 1,
            alignItems: 'center'
        },
        navigationContainer: {
            flexDirection: 'row',
            gap: 16,
            marginBottom: 32,
            alignItems: 'center'
        },
        navNumber: {
            width: 64,
            height: 64,
            borderRadius: 32,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
        },
        mobileNavNumber: {
            width: 40,
            height: 40,
            borderRadius: 20
        },
        mobileNavigationContainer: {
            marginVertical: 24
        },
        navNumberActive: {
            backgroundColor: '#FFFFFF',
            borderColor: '#FFFFFF'
        },
        navNumberText: {
            fontFamily: 'Bellefair_400Regular',
            fontSize: 18,
            color: '#FFFFFF'
        },
        navNumberTextActive: {
            color: '#0B0D17'
        },
        imageContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1
        },
        technologyImage: {
            width: screenWidth,
            height: screenHeight * 0.4,
        },
        desktopTechnologyImage: {
            width: 445,
            height: 527,
        },
        infoContainer: {
            alignItems: 'center',
            maxWidth: 327,
            paddingHorizontal: 16,
        },
        desktopInfoContainer: {
            alignItems: 'flex-start',
            flex: 1,
            justifyContent: 'center'
        },
        terminology: {
            fontFamily: 'Bellefair_400Regular',
            fontSize: 16,
            letterSpacing: 1.5,
            color: '#D0D6F9',
            marginBottom: 9,
            textAlign: 'center'
        },
        mobileTerminology: {
            fontSize: 16
        },
        desktopTerminology: {
            fontFamily: 'Bellefair_400Regular',
            fontSize: 32,
            letterSpacing: 2.7,
            color: '#D0D6F9',
            marginBottom: 11,
            textAlign: 'left'
        },
        technologyName: {
            fontFamily: 'Bellefair_400Regular',
            fontSize: 24,
            color: '#FFFFFF',
            marginBottom: 16,
            textAlign: 'center'
        },
        mobileTechnologyName: {
            fontSize: 28
        },
        desktopTechnologyName: {
            fontFamily: 'Bellefair_400Regular',
            fontSize: 56,
            color: '#FFFFFF',
            marginBottom: 24,
            textAlign: 'left'
        },
        technologyDescription: {
            fontFamily: 'Barlow_400Regular',
            fontSize: 16,
            lineHeight: 27.5,
            paddingVertical: 16,
            color: '#D0D6F9',
            textAlign: 'center'
        },
        desktopDescription: {
            fontFamily: 'Barlow_400Regular',
            fontSize: 18,
            lineHeight: 32,
            color: '#D0D6F9',
            textAlign: 'left',
            maxWidth: screenWidth * 0.35
        },
        placeholder: {
            fontFamily: 'Barlow_400Regular',
            fontSize: 16,
            color: '#D0D6F9',
            textAlign: 'center',
            marginTop: 24
        },
        desktopNavigationContainer: {
            flexDirection: 'column',
            gap: 32,
            alignItems: 'flex-start',
            alignSelf: 'center',
        },
    });
    
    const dynamicStyles = getStyles();

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenDimensions(window);
        });
        
        return () => subscription?.remove();
    }, []);

    const isTablet = screenWidth >= 768 && screenWidth < 1024;
    const isDesktop = screenWidth >= 1024;
    const isMobile = screenWidth < 768;
    

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
        const loadLastTechnology = async () => {
            try {
                const lastTechnology = await AsyncStorage.getItem('lastTechnology');
                if (lastTechnology) {
                    const technology = technologies.find(t => t.name === lastTechnology);
                    if (technology) {
                        setSelectedTechnology(technology);
                    }
                } else {
                    setSelectedTechnology(technologies[0]);
                }
            } catch (error) {
                console.log('Error loading last technology:', error);
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
        if (isMobile) {
            return require('../../assets/images/technology/background-technology-mobile.jpg');
        } else if (isTablet) {
            return require('../../assets/images/technology/background-technology-tablet.jpg');
        } else {
            return require('../../assets/images/technology/background-technology-desktop.jpg');
        }
    };

    const getTechnologyImage = (technology: Technology) => {
        const imageSet = technologyImages[technology.name as keyof typeof technologyImages];
        return isTablet ? imageSet.landscape : imageSet.portrait;
    };

    return (
        <View style={dynamicStyles.container} {...swipeHandler}>
            <ImageBackground
                source={getBackgroundSource()}
                style={[dynamicStyles.bg, { minHeight: screenHeight }]}
                resizeMode="cover"
            >
                <ScrollView contentContainerStyle={{ minHeight: screenHeight }}>
                    <NavBar />
                    <Animated.ScrollView
                        style={[
                            dynamicStyles.scrollContainer, 
                            { 
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ] 
                            }
                        ]}
                        contentContainerStyle={[dynamicStyles.content, isDesktop && dynamicStyles.desktopContent]}
                    >
                        {isDesktop ? (
                            <Text style={dynamicStyles.desktopPageTitle}>
                                <Text style={dynamicStyles.pageNumber}>03</Text>
                                {'  '}SPACE LAUNCH 101
                            </Text>
                        ) : (
                            <Text style={dynamicStyles.pageTitle}>
                                <Text style={dynamicStyles.pageNumber}>03</Text>
                                {'  '}SPACE LAUNCH 101
                            </Text>
                        )}

                        <View style={[dynamicStyles.pageContentWrapper, isDesktop && dynamicStyles.desktopPageContentWrapper]}>
                            {isDesktop ? (
                                <View style={dynamicStyles.desktopLayout}>
                                    <View style={[dynamicStyles.navigationContainer, dynamicStyles.desktopNavigationContainer]}>
                                        {technologies.map((technology, index) => (
                                            <Pressable
                                                key={technology.name}
                                                style={[
                                                    dynamicStyles.navNumber,
                                                    selectedTechnology?.name === technology.name && dynamicStyles.navNumberActive
                                                ]}
                                                onPress={() => selectTechnology(technology)}
                                            >
                                                <Text style={[
                                                    dynamicStyles.navNumberText,
                                                    selectedTechnology?.name === technology.name && dynamicStyles.navNumberTextActive
                                                ]}>
                                                    {index + 1}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>

                                    <View style={dynamicStyles.leftColumn}>
                                        {selectedTechnology && (
                                            <View style={dynamicStyles.desktopInfoContainer}>
                                                <Text style={dynamicStyles.desktopTerminology}>THE TERMINOLOGY...</Text>
                                                <Text style={dynamicStyles.desktopTechnologyName}>{selectedTechnology.name.toUpperCase()}</Text>
                                                <Text style={dynamicStyles.desktopDescription}>{selectedTechnology.description}</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={dynamicStyles.rightColumn}>
                                        {selectedTechnology && (
                                            <Image
                                                source={getTechnologyImage(selectedTechnology)}
                                                style={dynamicStyles.desktopTechnologyImage}
                                                resizeMode="contain"
                                            />
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <View style={dynamicStyles.mobileContentWrapper}>
                                    {selectedTechnology ? (
                                        <View style={dynamicStyles.mobileContentLayout}>
                                            <View style={dynamicStyles.imageContainer}>
                                                <Image
                                                    source={getTechnologyImage(selectedTechnology)}
                                                    style={dynamicStyles.technologyImage}
                                                    resizeMode="contain"
                                                />
                                            </View>

                                            <View style={[dynamicStyles.navigationContainer, dynamicStyles.mobileNavigationContainer]}>
                                                {technologies.map((technology, index) => (
                                                    <Pressable
                                                        key={technology.name}
                                                        style={[
                                                            dynamicStyles.navNumber,
                                                            dynamicStyles.mobileNavNumber,
                                                            selectedTechnology?.name === technology.name && dynamicStyles.navNumberActive
                                                        ]}
                                                        onPress={() => selectTechnology(technology)}
                                                    >
                                                        <Text style={[
                                                            dynamicStyles.navNumberText,
                                                            selectedTechnology?.name === technology.name && dynamicStyles.navNumberTextActive
                                                        ]}>
                                                            {index + 1}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </View>

                                            <View style={dynamicStyles.infoContainer}>
                                                <Text style={[dynamicStyles.terminology, dynamicStyles.mobileTerminology]}>THE TERMINOLOGY...</Text>
                                                <Text style={[dynamicStyles.technologyName, dynamicStyles.mobileTechnologyName]}>{selectedTechnology.name.toUpperCase()}</Text>
                                                <Text style={dynamicStyles.technologyDescription}>{selectedTechnology.description}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <Text style={dynamicStyles.placeholder}>Loading technology...</Text>
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

