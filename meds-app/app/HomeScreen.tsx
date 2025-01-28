import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from './ThemeContext';
import { getTotalStockQuantity } from "./supabase";

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [currentStock, setCurrentStock] = useState(0);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchStockQuantity = async () => {
            const stock = await getTotalStockQuantity();
            setCurrentStock(stock);
        };

        fetchStockQuantity();
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.overviewContainer, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.overviewTitle, { color: '#ffffff' }]}>Current Stock</Text>
                <Text style={[styles.overviewNumber, { color: '#ffffff' }]}>{currentStock}</Text>
            </View>
            <View style={styles.cardsContainer}>
                <Card style={[styles.card, { backgroundColor: theme.colors.background }]} onPress={() => navigation.navigate('Meds')}>
                    <Card.Content>
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Manage Medications</Text>
                        <Text style={[styles.cardDescription, { color: theme.colors.text }]}>Add, update, or view your medications.</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.card, { backgroundColor: theme.colors.background }]} onPress={() => navigation.navigate('Inventory')}>
                    <Card.Content>
                        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Inventory</Text>
                        <Text style={[styles.cardDescription, { color: theme.colors.text }]}>Check and update your medication inventory.</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    overviewContainer: {
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    overviewTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    overviewNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    trendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    trendText: {
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    cardsContainer: {
        flex: 1,
    },
    card: {
        marginBottom: 15,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardDescription: {
        fontSize: 14,
        marginTop: 5,
    },
});

export default HomeScreen;
