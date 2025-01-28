import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signUp, signIn } from "./supabase";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

const AuthScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState("");
    const { logIn } = useAuth();
    const { theme } = useTheme();

    const handleAuth = async () => {
        if (isSignUp) {
            const { error } = await signUp(email, password);
            if (!error) {
                setMessage("Registration successful!");
                setIsSignUp(false);
            } else {
                setMessage(error.message);
            }
        } else {
            const { error } = await signIn(email, password);
            if (!error) {
                logIn();
                setMessage("");
            } else {
                setMessage(error.message);
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
                {isSignUp ? "Register" : "Login"}
            </Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.text,
                        color: theme.colors.text,
                    },
                ]}
                placeholder="Email"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="email-address"
                onChangeText={setEmail}
                value={email}
            />
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.text,
                        color: theme.colors.text,
                    },
                ]}
                placeholder="Password"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleAuth}
            >
                <Text style={styles.actionButtonText}>
                    {isSignUp ? "Register" : "Login"}
                </Text>
            </TouchableOpacity>
            <Text
                style={[styles.toggle, { color: theme.colors.primary }]}
                onPress={() => setIsSignUp(!isSignUp)}
            >
                {isSignUp
                    ? "Already have an account? Login"
                    : "Don't have an account? Register"}
            </Text>
            {message && <Text style={[styles.message, { color: theme.colors.error }]}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    actionButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    toggle: {
        marginTop: 15,
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
    },
    message: {
        marginTop: 20,
        textAlign: "center",
        fontSize: 14,
    },
});

export default AuthScreen;
