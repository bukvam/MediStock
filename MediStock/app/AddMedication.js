import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { addMedication, fetchMedications } from './supabase';
import { Camera, CameraView } from 'expo-camera';
import { useTheme } from './ThemeContext';

const AddMedicationScreen = () => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [barcode, setBarcode] = useState('');
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [scanning, setScanning] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const handleBarcodeScanned = ({ data }) => {
        setScanning(false);
        setBarcode(data);
    };

    const handleAddMedication = async () => {
        if (!name || !quantity) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        try {

            await addMedication(name, parseInt(quantity), barcode);
            Alert.alert('Success', 'Medication added successfully!');
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to add medication.');
        }
    };

    if (hasPermission === null) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                    Requesting camera permission...
                </Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                    No access to camera. Please enable camera permissions.
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Medication Name</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                    },
                ]}
                placeholder="Enter medication name"
                placeholderTextColor={theme.colors.placeholder}
                value={name}
                onChangeText={setName}
            />
            <Text style={[styles.label, { color: theme.colors.text }]}>Quantity</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                    },
                ]}
                placeholder="Enter quantity"
                placeholderTextColor={theme.colors.placeholder}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
            />
            <Text style={[styles.label, { color: theme.colors.text }]}>Barcode</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: theme.colors.card,
                        color: theme.colors.text,
                    },
                ]}
                placeholder="Barcode"
                placeholderTextColor={theme.colors.placeholder}
                value={barcode}
                onChangeText={setBarcode}
            />
            <TouchableOpacity
                style={[
                    styles.scanButton,
                    { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setScanning(true)}
            >
                <Text style={[styles.scanButtonText]}>Scan Barcode</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.secondary }]}
                onPress={handleAddMedication}
            >
                <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>
            {scanning && (
                <View style={styles.scannerContainer}>
                    <CameraView
                        onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
                        barcodeScannerSettings={{
                            barcodeTypes: [
                                'qr',
                                'pdf417',
                                'upc_a',
                                'upc_e',
                                'ean13',
                                'ean8',
                            ],
                        }}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.closeScannerButtonContainer}>
                        <Button
                            title="Close Scanner"
                            color="#fff"
                            onPress={() => setScanning(false)}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
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
    addButton: {
        marginTop: 10,
        marginBottom: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },
    addButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    scanButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },
    scanButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
    },
    absoluteFillObject: {
        borderRadius: 16,
    },
    closeScannerButtonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 10,
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
    },
});

export default AddMedicationScreen;
