import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Switch } from 'react-native-paper';
import { useAuth0 } from 'react-native-auth0';

export default function SettingsScreen({ navigation }) {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    // Funkce pro přepínání režimu (např. tmavý světelný režim)
    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const { clearSession } = useAuth0();

    // Funkce pro odhlášení uživatele
    const handleLogout = async () => {
        try {
            await clearSession();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            {/* Nastavení pro tmavý režim */}
            <View style={styles.settingRow}>
                <Text>Dark Mode</Text>
                <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
            </View>

            {/* Tlačítko pro odhlášení */}
            <Button mode="contained" onPress={handleLogout} style={styles.button}>
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
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
    },
});
