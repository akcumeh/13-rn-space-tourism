import { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, Modal, Dimensions, Animated } from 'react-native';
import { router, usePathname } from 'expo-router';
import LogoSvg from '../assets/images/shared/logo.svg';

export default function NavBar() {
    const [open, setOpen] = useState(false);
    const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const slideAnim = useRef(new Animated.Value(254)).current; // Start offscreen
    const pathname = usePathname();

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });
        return () => subscription?.remove();
    }, []);

    // Animate menu in/out
    useEffect(() => {
        if (open) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 254,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [open, slideAnim]);

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
        setOpen(false);
        router.push(route as any);
    };

    const isDesktop = screenWidth >= 960;

    if (isDesktop) {
        // Desktop Navigation
        return (
            <View style={styles.desktopWrap}>
                <Pressable onPress={() => navigateToScreen('/home')}>
                    <LogoSvg width={48} height={48} />
                </Pressable>
                
                <View style={styles.desktopLine} />
                
                <View style={styles.desktopMenu}>
                    {menuItems.map((item) => (
                        <Pressable
                            key={item.number}
                            style={[
                                styles.desktopMenuItem,
                                {
                                    borderBottomColor: isActiveRoute(item.route) 
                                        ? '#FFFFFF' 
                                        : hoveredItem === item.route 
                                            ? 'rgba(255, 255, 255, 0.5)' 
                                            : 'transparent'
                                }
                            ]}
                            onPress={() => navigateToScreen(item.route)}
                            onPressIn={() => setHoveredItem(item.route)}
                            onPressOut={() => setHoveredItem(null)}
                        >
                            <Text style={styles.desktopMenuText}>
                                <Text style={styles.desktopMenuNumber}>{item.number}</Text>
                                {'  '}{item.title}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        );
    }

    // Mobile Navigation
    return (
        <View style={styles.wrap}>
            <Pressable onPress={() => navigateToScreen('/home')}>
                <LogoSvg width={48} height={48} />
            </Pressable>
            <Pressable onPress={() => setOpen(!open)}>
                {open ? (
                    <Text style={styles.closeIcon}>✕</Text>
                ) : (
                    <View style={styles.hamburger}>
                        <View style={styles.line} />
                        <View style={styles.line} />
                        <View style={styles.line} />
                    </View>
                )}
            </Pressable>

            <Modal
                visible={open}
                transparent={true}
                animationType="none"
                onRequestClose={() => setOpen(false)}
            >
                <View style={styles.modalContainer}>
                    <Pressable style={styles.overlay} onPress={() => setOpen(false)} />
                    <Animated.View style={[
                        styles.menu,
                        {
                            transform: [{ translateX: slideAnim }]
                        }
                    ]}>
                        {menuItems.map((item) => (
                            <Pressable
                                key={item.number}
                                style={[
                                    styles.menuItem,
                                    {
                                        borderRightColor: isActiveRoute(item.route) 
                                            ? '#FFFFFF' 
                                            : hoveredItem === item.route 
                                                ? 'rgba(255, 255, 255, 0.5)' 
                                                : 'transparent'
                                    }
                                ]}
                                onPress={() => navigateToScreen(item.route)}
                                onPressIn={() => setHoveredItem(item.route)}
                                onPressOut={() => setHoveredItem(null)}
                            >
                                <Text style={[
                                    styles.menuText,
                                    isActiveRoute(item.route) && styles.activeMenuText
                                ]}>
                                    <Text style={styles.menuNumber}>{item.number}</Text>
                                    {'  '}{item.title}
                                </Text>
                            </Pressable>
                        ))}
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    // Mobile Styles
    wrap: {
        position: 'absolute',
        top: 0.025*screenWidth,
        width: '100%',
        left: 0,
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
        height: 2,
        backgroundColor: '#D0D6F9',
        width: '100%',
        zIndex: 3
    },
    closeIcon: {
        color: '#D0D6F9',
        fontSize: 20,
        fontWeight: '300'
    },
    modalContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    menu: {
        width: 254,
        backgroundColor: 'rgba(11, 13, 23, 0.15)',
        backdropFilter: 'blur(40px)',
        paddingTop: 118,
    },
    menuItem: {
        width: '100%',
        paddingVertical: 8,
        paddingLeft: 32,
        paddingRight: 32,
        marginVertical: 8,
        borderRightWidth: 4,
        borderRightColor: 'transparent'
    },
    menuText: {
        fontFamily: 'BarlowCondensed_400Regular',
        color: '#FFFFFF',
        fontSize: 16,
        letterSpacing: 2.7
    },
    activeMenuText: {
        opacity: 1
    },
    menuNumber: {
        fontWeight: 'bold',
        opacity: 0.5,
    },

    // Desktop Styles
    desktopWrap: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 96,
        paddingLeft: 75,
        paddingTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100
    },
    desktopLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        marginLeft: 55,
        width: 0.5 * screenWidth,
        zIndex: 150
    },
    desktopMenu: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(40px)',
        paddingLeft: 126,
        paddingRight: 25,
        height: 96,
        alignItems: 'center'
    },
    desktopMenuItem: {
        paddingVertical: 38,
        marginHorizontal: 24,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent'
    },
    desktopMenuText: {
        fontFamily: 'BarlowCondensed_400Regular',
        color: '#FFFFFF',
        fontSize: 16,
        letterSpacing: 2.7
    },
    desktopMenuNumber: {
        fontWeight: '700',
        opacity: 0.5,
    }
});