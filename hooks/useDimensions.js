import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

const useDimensions = () => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setDimensions(window);
        });
        return () => subscription?.remove();
    }, []);

    const { width: screenWidth, height: screenHeight } = dimensions;

    // Computed responsive values
    const computed = {
        // Image dimensions
        imageMaxHeight: screenHeight * 0.7,
        imageWidth: screenWidth * 0.33,
        
        // Mobile image dimensions (smaller screens)
        mobileImageHeight: screenHeight * 0.5,
        mobileImageWidth: screenWidth * 0.8,
        
        // Padding and margins
        paddingHorizontal: screenWidth * 0.05, // 5% of screen width
        paddingVertical: screenHeight * 0.03,   // 3% of screen height
        
        // Desktop specific
        desktopPaddingHorizontal: screenWidth * 0.08, // 8% of screen width
        desktopPaddingTop: screenHeight * 0.15,       // 15% of screen height
        
        // Navigation and UI elements
        navButtonSize: Math.min(screenWidth, screenHeight) * 0.08,
        dotSize: Math.min(screenWidth, screenHeight) * 0.015,
        
        // Typography scaling
        titleFontSize: screenWidth * 0.04,
        bodyFontSize: screenWidth * 0.035,
        
        // Container dimensions
        containerMaxWidth: screenWidth * 0.9,
        desktopContainerMaxWidth: screenWidth * 0.85,
        
        // Gaps and spacing
        smallGap: screenWidth * 0.04,
        mediumGap: screenWidth * 0.06,
        largeGap: screenWidth * 0.08,
        
        // Breakpoints
        isTablet: screenWidth >= 640 && screenWidth < 960,
        isDesktop: screenWidth >= 960,
        isMobile: screenWidth < 640,
    };

    return {
        screenWidth,
        screenHeight,
        ...computed
    };
};

export default useDimensions;