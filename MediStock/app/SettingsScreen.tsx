import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Switch } from 'react-native-paper';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';

export default function SettingsScreen() {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { logOut } = useAuth();

    const handleLogout = async () => {
        try {
            logOut();
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
            <View style={styles.settingRow}>
                <Text style={{ color: theme.colors.text }}>Dark Mode</Text>
                <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    color={theme.colors.primary}
                />
            </View>
            <Button
                mode="contained"
                onPress={handleLogout}
                style={styles.button}
                labelStyle={{ color: '#ffffff' }}
                buttonColor={theme.colors.primary}
            >
                Log Out
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    button: {
        marginTop: 20,
        borderRadius: 8,
        fontWeight: '700',
    },
});
