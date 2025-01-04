import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

const InventoryScreen: React.FC = () => {
    const handleInventoryCheck = async () => {
        console.log('Start inventory scan...');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Inventory management is here!</Text>
            <Button mode="contained" onPress={handleInventoryCheck}>
                Start Inventory
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginBottom: 20,
        fontSize: 18,
    },
});

export default InventoryScreen;
