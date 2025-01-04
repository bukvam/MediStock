import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { account } from './appwrite';

interface AuthScreenProps {
    navigation: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleAuth = async () => {
        try {
            if (isRegistering) {
                await account.create('unique()', email, password);
            }
            await account.createSession(email, password);
            navigation.replace('Home');
        } catch (error) {
            console.error('Auth Error:', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <Button mode="contained" onPress={handleAuth}>
                {isRegistering ? 'Register' : 'Login'}
            </Button>
            <Text
                onPress={() => setIsRegistering(!isRegistering)}
                style={styles.toggle}
            >
                {isRegistering
                    ? 'Already have an account? Login'
                    : 'No account? Register'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 20,
    },
    toggle: {
        textAlign: 'center',
        marginTop: 20,
        color: 'blue',
    },
});

export default AuthScreen;
