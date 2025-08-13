import { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const { width } = Dimensions.get('window');
    const slideAnim = useRef(new Animated.Value(width)).current;

    const openMenu = () => {
        setOpen(true);
        Animated.timing(slideAnim, {
            toValue: width - 254,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(slideAnim, {
            toValue: width,
            duration: 300,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: false
        }).start(() => setOpen(false));
    };

    return (
        <View style={styles.wrap}>
            <Text style={styles.logo}>*</Text>
            <Pressable onPress={open ? closeMenu : openMenu}>
                <View style={styles.hamburger}>
                    <View style={styles.line} />
                    <View style={styles.line} />
                    <View style={styles.line} />
                </View>
            </Pressable>

            {open && (
                <>
                    <Pressable style={styles.overlay} onPress={closeMenu} />
                    <Animated.View style={[styles.menu, { left: slideAnim }]}>
                        <Pressable
                            style={styles.menuItem}
                            onPress={() => {
                                closeMenu();
                                router.push('/home');
                            }}
                        >
                            <Text style={styles.menuText}>00 HOME</Text>
                        </Pressable>
                        <Pressable
                            style={styles.menuItem}
                            onPress={() => {
                                closeMenu();
                                router.push('/destination');
                            }}
                        >
                            <Text style={styles.menuText}>01 DESTINATION</Text>
                        </Pressable>
                    </Animated.View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 48,
        height: 96,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
    },
    logo: {
        color: '#ffffff',
        fontSize: 40
    },
    hamburger: {
        width: 24,
        height: 21,
        justifyContent: 'space-between'
    },
    line: {
        height: 3,
        backgroundColor: '#D0D6F9',
        width: '100%'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    menu: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 254,
        backgroundColor: 'rgba(11, 13, 23, 0.95)',
        paddingTop: 118,
        paddingLeft: 32
    },
    menuItem: {
        paddingVertical: 16
    },
    menuText: {
        color: '#ffffff',
        fontSize: 16,
        letterSpacing: 2
    }
});