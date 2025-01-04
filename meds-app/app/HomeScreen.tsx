import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Card style={styles.card} onPress={() => navigation.navigate('Medications')}>
                <Card.Content>
                    <Title>Manage Medications</Title>
                    <Paragraph>Add, update, or view your medications.</Paragraph>
                </Card.Content>
            </Card>
            <Card style={styles.card} onPress={() => navigation.navigate('Inventory')}>
                <Card.Content>
                    <Title>Inventory</Title>
                    <Paragraph>Check and update your medication inventory.</Paragraph>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        marginVertical: 10,
    },
});

export default HomeScreen;
