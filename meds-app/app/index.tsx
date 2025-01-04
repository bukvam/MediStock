import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth0 } from "react-native-auth0";

const IndexScreen = () => {
    const { user } = useAuth0();
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (user) {
                router.replace('/HomeScreen');
            } else {
                router.replace('/App');
            }
        }, 200);

        return () => clearTimeout(timeout);
    }, [user, router]);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Redirecting...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        fontSize: 18,
        color: 'gray',
    },
});

export default IndexScreen;
