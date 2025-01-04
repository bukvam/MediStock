import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

const LoggedOut: React.FC = () => {
    const { authorize, user } = useAuth0();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        }
    }, [user]);

    const handleLogin = async () => {
        try {
            console.log("Attempting to log in...");
            await authorize();
            console.log("Login successful!");
            router.replace('/Navigation');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <View>
            {!isLoggedIn ? (
                <Button title="Log in" onPress={handleLogin} />
            ) : (
                <Text>Welcome, {user?.name}!</Text>
            )}
        </View>
    );
};

export default LoggedOut;
