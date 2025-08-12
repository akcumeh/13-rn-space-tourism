import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const planets = [
    { id: 1, name: 'Moon', emoji: '🌙', color: '#C0C0C0' },
    { id: 2, name: 'Mars', emoji: '🔴', color: '#CD5C5C' },
    { id: 3, name: 'Europa', emoji: '❄️', color: '#87CEEB' },
    { id: 4, name: 'Titan', emoji: '🟡', color: '#DAA520' }
];

export default function App() {
    const [selectedPlanet, setSelectedPlanet] = useState(null);

    useEffect(() => {
        loadSavedPlanet();
    }, []);

    const loadSavedPlanet = async () => {
        try {
            const saved = await AsyncStorage.getItem('selectedPlanet');
            if (saved) {
                setSelectedPlanet(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading saved planet:', error);
        }
    };

    // @ts-ignore
    const selectPlanet = async (planet) => {
        try {
            await AsyncStorage.setItem('selectedPlanet', JSON.stringify(planet));
            setSelectedPlanet(planet);
        } catch (error) {
            console.error('Error saving planet:', error);
        }
    };

    const clearSavedPlanet = async () => {
        try {
            await AsyncStorage.removeItem('selectedPlanet');
            setSelectedPlanet(null);
        } catch (error) {
            console.error('Error clearing planet:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Planet</Text>

            <View style={styles.planetsGrid}>
                {planets.map((planet) => (
                    <TouchableOpacity
                        key={planet.id}
                        style={[styles.planetButton, { borderColor: planet.color }]}
                        onPress={() => selectPlanet(planet)}
                    >
                        <Text style={styles.planetEmoji}>{planet.emoji}</Text>
                        <Text style={styles.planetName}>{planet.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedPlanet && (
                <View style={styles.selectedSection}>
                    <Text style={styles.selectedText}>
                        Your preferred planet: {selectedPlanet.name}
                    </Text>
                    <TouchableOpacity style={styles.clearButton} onPress={clearSavedPlanet}>
                        <Text style={styles.clearButtonText}>Clear Saved Planet</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: 'bold',
    },
    planetsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    planetButton: {
        width: '45%',
        alignItems: 'center',
        marginBottom: 30,
        padding: 20,
        backgroundColor: '#16213e',
        borderRadius: 15,
        borderWidth: 2,
    },
    planetEmoji: {
        fontSize: 50,
        marginBottom: 10,
    },
    planetName: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    selectedSection: {
        marginTop: 40,
        alignItems: 'center',
    },
    selectedText: {
        color: '#4fc3f7',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    clearButton: {
        backgroundColor: '#f44336',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});