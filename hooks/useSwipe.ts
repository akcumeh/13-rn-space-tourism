import { useRef } from 'react';
import { useRouter } from 'expo-router';

type SwipeDirection = 'left' | 'right';
type ContentSwipeHandler = (direction: SwipeDirection) => void;

const useSwipe = (currentPage: string, onContentSwipe: ContentSwipeHandler | null = null) => {
    const startX = useRef(0);
    const startTime = useRef(0);
    const isHolding = useRef(false);
    const router = useRouter();

    const routes = [
        { name: 'home', path: '/' },
        { name: 'destination', path: '/destination' },
        { name: 'crew', path: '/crew' },
        { name: 'technology', path: '/technology' }
    ];

    const currentIndex = routes.findIndex(r => r.name === currentPage);
    const hasContentPagination = currentPage === 'crew' || currentPage === 'technology';

    const handleStart = (event: any) => {
        startX.current = event.nativeEvent.locationX;
        startTime.current = Date.now();
        isHolding.current = false;
        return true;
    };

    const handleMove = (event: any) => {
        const holdDuration = Date.now() - startTime.current;
        if (holdDuration >= 500 && !isHolding.current) {
            isHolding.current = true;
        }
        return true;
    };

    const handleRelease = (event: any) => {
        const endX = event.nativeEvent.locationX;
        const diff = endX - startX.current;
        const threshold = 50;
        const holdDuration = Date.now() - startTime.current;

        if (Math.abs(diff) > threshold) {
            if (isHolding.current || holdDuration >= 500) {
                if (diff > 0 && currentIndex > 0) {
                    router.push(routes[currentIndex - 1].path as any);
                } else if (diff < 0 && currentIndex < routes.length - 1) {
                    router.push(routes[currentIndex + 1].path as any);
                }
            } else if (hasContentPagination && onContentSwipe) {
                const direction = diff > 0 ? 'right' : 'left';
                onContentSwipe(direction);
            }
        }

        startX.current = 0;
        startTime.current = 0;
        isHolding.current = false;
    };

    return {
        onStartShouldSetResponder: handleStart,
        onMoveShouldSetResponder: handleMove,
        onResponderMove: handleMove,
        onResponderRelease: handleRelease
    };
};

export default useSwipe;