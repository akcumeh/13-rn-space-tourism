import { useEffect, useState } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import NavBar from '../../components/NavBar';

const crewData = [
    {
        name: "Douglas Hurley",
        role: "Commander",
        bio: "Douglas Gerald Hurley is an American engineer, former Marine Corps pilot and former NASA astronaut. He launched into space for the third time as commander of Crew Dragon Demo-2.",
        image: require('../../assets/images/crew/image-douglas-hurley.png')
    },
    {
        name: "Mark Shuttleworth",
        role: "Mission Specialist",
        bio: "Mark Richard Shuttleworth is the founder and CEO of Canonical, the company behind the Linux-based Ubuntu operating system. Shuttleworth became the first South African to travel to space as a space tourist.",
        image: require('../../assets/images/crew/image-mark-shuttleworth.png')
    },
    {
        name: "Victor Glover",
        role: "Pilot",
        bio: "Pilot on the first operational flight of the SpaceX Crew Dragon to the International Space Station. Glover is a commander in the U.S. Navy where he pilots an F/A-18.He was a crew member of Expedition 64, and served as a station systems flight engineer.",
        image: require('../../assets/images/crew/image-victor-glover.png')
    },
    {
        name: "Anousheh Ansari",
        role: "Flight Engineer",
        bio: "Anousheh Ansari is an Iranian American engineer and co-founder of Prodea Systems. Ansari was the fourth self-funded space tourist, the first self-funded woman to fly to the ISS, and the first Iranian in space.",
        image: require('../../assets/images/crew/image-anousheh-ansari.png')
    }
];

export default function CrewScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        AsyncStorage.setItem('lastScreen', 'Crew');
    }, []);

    const currentCrew = crewData[currentIndex];

    return (
        <ImageBackground
            source={require('../../assets/images/crew/bg-crew-mob.jpg')}
            style={styles.bg}
            resizeMode="cover"
        >
            <NavBar />
            <View style={styles.content}>
                <Text style={styles.pageTitle}>02 MEET YOUR CREW</Text>

                <View style={styles.crewInfo}>
                    <Text style={styles.role}>{currentCrew.role.toUpperCase()}</Text>
                    <Text style={styles.name}>{currentCrew.name.toUpperCase()}</Text>
                    <Text style={styles.bio}>{currentCrew.bio}</Text>
                </View>

                <View style={styles.pagination}>
                    {crewData.map((_, index) => (
                        <Pressable
                            key={index}
                            style={[
                                styles.dot,
                                index === currentIndex && styles.activeDot
                            ]}
                            onPress={() => setCurrentIndex(index)}
                        />
                    ))}
                </View>

                <View style={styles.imageContainer}>
                    <Image source={currentCrew.image} style={styles.crewImage} resizeMode="contain" />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: '#000'
    },
    content: {
        flex: 1,
        paddingTop: 120,
        paddingHorizontal: 24
    },
    pageTitle: {
        fontFamily: 'BarlowCondensed_400Regular',
        color: '#ffffff',
        fontSize: 16,
        letterSpacing: 2.7,
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '400'
    },
    crewInfo: {
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 20
    },
    role: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 16,
        letterSpacing: 0,
        marginBottom: 8,
        fontFamily: 'Bellefair_400Regular'
    },
    name: {
        color: '#ffffff',
        fontSize: 24,
        lineHeight: 28,
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'Bellefair_400Regular'
    },
    bio: {
        color: '#D0D6F9',
        fontSize: 15,
        lineHeight: 25,
        textAlign: 'center',
        maxWidth: 327,
        fontFamily: 'Barlow_400Regular'
    },
    pagination: {
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
        backgroundColor: '#ffffff'
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: 300
    },
    crewImage: {
        width: '80%',
        height: '90%',
        maxWidth: 300,
        maxHeight: 400
    }
});