import { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, usePathname } from 'expo-router';
import LogoSvg from '../assets/images/shared/logo.svg';

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const { width } = Dimensions.get('window');
    const slideAnim = useRef(new Animated.Value(width)).current;
    const pathname = usePathname();

    const openMenu = () => {
        setOpen(true);
        Animated.timing(slideAnim, {
            toValue: width - 254,
            duration: 250,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(slideAnim, {
            toValue: width,
            duration: 250,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: false
        }).start(() => setOpen(false));
    };

    const menuItems = [
        { number: '00', title: 'HOME', route: '/home' },
        { number: '01', title: 'DESTINATION', route: '/destination' },
        { number: '02', title: 'CREW', route: '/crew' },
        { number: '03', title: 'TECHNOLOGY', route: '/technology' }
    ];

    const isActiveRoute = (route: string) => {
        return pathname === route;
    };

    const navigateToScreen = (route: string) => {
        closeMenu();
        router.push(route as any);
    };

    return (
        <View style={styles.wrap}>
            <Pressable onPress={() => navigateToScreen('/home')}>
                <LogoSvg width={48} height={48} />
            </Pressable>
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
                        {menuItems.map((item) => (
                            <Pressable
                                key={item.number}
                                style={[
                                    styles.menuItem,
                                    isActiveRoute(item.route) && styles.menuItemActive
                                ]}
                                onPress={() => navigateToScreen(item.route)}
                            >
                                <Text style={styles.menuText}>
                                    <Text style={styles.menuNumber}>{item.number}</Text>
                                    {'     '}{item.title}
                                </Text>
                            </Pressable>
                        ))}
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
        backgroundColor: 'rgba(11, 13, 23, 0.85)',
        backdropFilter: 'blur(40px)',
        paddingTop: 118,
        paddingLeft: 32
    },
    menuItem: {
        paddingVertical: 16,
        borderLeftWidth: 4,
        borderLeftColor: 'transparent',
        paddingLeft: 32
    },
    menuItemActive: {
        borderLeftColor: '#FFFFFF'
    },
    menuText: {
        fontFamily: 'BarlowCondensed_400Regular',
        color: '#FFFFFF',
        fontSize: 16,
        letterSpacing: 2.7
    },
    menuNumber: {
        fontWeight: '700'
    }
});