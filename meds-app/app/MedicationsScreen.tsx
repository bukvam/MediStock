import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Button, List, FAB } from 'react-native-paper';
import { database } from './appwrite';

const MedicationsScreen: React.FC = () => {
    const [medications, setMedications] = useState<any[]>([]);

    const fetchMedications = async () => {
        try {
            const response = await database.listDocuments(
                'YOUR_DATABASE_ID',
                'YOUR_COLLECTION_ID'
            );
            setMedications(response.documents);
        } catch (error) {
            console.error('Fetch Medications Error:', error);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={medications}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => (
                    <List.Item
                        title={item.name}
                        description={`Quantity: ${item.quantity}`}
                        left={(props) => <List.Icon {...props} icon="pill" />}
                    />
                )}
            />
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => console.log('Add Medication')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
});

export default MedicationsScreen;
