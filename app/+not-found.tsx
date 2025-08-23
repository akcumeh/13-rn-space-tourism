import { View, Text } from 'react-native';

export default function NotFound() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B0D17' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 24 }}>Page Not Found</Text>
        </View>
    );
}