import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Vibration
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Camera, CameraView } from "expo-camera";
import { fetchMedications, updateMedication } from "./supabase";
import { useTheme } from "./ThemeContext";

export default function InventoryScreen() {
    const { theme } = useTheme();
    const [medications, setMedications] = useState([]);
    const [updatedMedications, setUpdatedMedications] = useState([]);
    const [isInventoryActive, setIsInventoryActive] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [barcode, setBarcode] = useState('');
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [isAlertVisible, setIsAlertVisible] = useState(false);


    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        if (isInventoryActive) {
            fetchMedications().then((data) => setMedications(data));
        }
        getCameraPermissions();
    }, [isInventoryActive]);

    const handleStartInventory = () => {
        setIsInventoryActive(true);
    };

    const handleQuantityChange = (id, change) => {
        const newUpdatedMedications = [...updatedMedications];
        const medicationIndex = newUpdatedMedications.findIndex(med => med.id === id);

        if (medicationIndex === -1) {
            newUpdatedMedications.push({ id, quantity: Math.max(0, change) });
        } else {
            newUpdatedMedications[medicationIndex].quantity = Math.max(0, newUpdatedMedications[medicationIndex].quantity + change);
        }

        setUpdatedMedications(newUpdatedMedications);
    };

    const handleFinishInventory = () => {
        Alert.alert(
            "Confirm Inventory",
            "Are you sure you want to finish and save the inventory?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes",
                    onPress: async () => {
                        const medicationsToUpdate = medications.map((med) => {
                            const updatedMed = updatedMedications.find(medUpdate => medUpdate.id === med.id);
                            return {
                                id: med.id,
                                quantity_in_stock: updatedMed ? updatedMed.quantity : 0,
                            };
                        });

                        for (const med of medicationsToUpdate) {
                            await updateMedication(med.id, med.quantity_in_stock);
                        }

                        Alert.alert("Success", "Inventory updated successfully!");
                        setIsInventoryActive(false);
                        setUpdatedMedications([]);
                    }
                }
            ]
        );
    };

    const handleBarcodeScanned = ({ data }) => {
        if (isAlertVisible) return;

        setScanning(false);
        setBarcode(data);
        console.log(medications);
        const matchedMedication = medications.find((med) => med.barcodes && med.barcodes.includes(data));

        if (matchedMedication) {
            const updatedMedication = updatedMedications.find(med => med.id === matchedMedication.id);
            const newQuantity = updatedMedication ? updatedMedication.quantity + 1 : 1;

            setUpdatedMedications(prev => {
                const updated = [...prev];
                const index = updated.findIndex(med => med.id === matchedMedication.id);
                if (index === -1) {
                    updated.push({ id: matchedMedication.id, quantity: newQuantity });
                } else {
                    updated[index].quantity = newQuantity;
                }
                return updated;
            });

            Vibration.vibrate();
            setIsAlertVisible(true);

            setTimeout(() => {
                setIsAlertVisible(false);
            }, 2000); // Display success message for 2 seconds
        } else {
            if (!isAlertVisible) {
                setIsAlertVisible(true);

                Alert.alert("Error", "No medication found with this barcode.", [
                    {
                        text: "OK",
                        onPress: () => {
                            setIsAlertVisible(false);
                        }
                    }
                ]);
            }
        }

        setTimeout(() => {
            setScanning(true);
        }, 250);
    };



    const renderMedicationItem = ({ item }) => {
        const updatedMedication = updatedMedications.find(med => med.id === item.id);
        const currentQuantity = updatedMedication ? updatedMedication.quantity : 0;

        return (
            <View style={styles.medicationItem}>
                <Text style={[styles.medicationName, { color: theme.colors.text }]}>
                    {item.name}
                </Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleQuantityChange(item.id, -1)}
                    >
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{currentQuantity}</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleQuantityChange(item.id, 1)}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {!isInventoryActive ? (
                <TouchableOpacity
                    style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleStartInventory}
                >
                    <Text style={styles.startButtonText}>Start Inventory</Text>
                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity
                        style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
                        onPress={() => setScanning(true)}
                    >
                        <Text style={styles.scanButtonText}>Open Scanner</Text>
                    </TouchableOpacity>
                    {scanning && (
                        <View style={styles.scannerContainer}>
                            <CameraView
                                onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
                                barcodeScannerSettings={{
                                    barcodeTypes: ['qr', 'pdf417', 'upc_a', 'upc_e', 'ean13', 'ean8'],
                                }}
                                style={StyleSheet.absoluteFillObject}
                            />
                            <View style={styles.closeScannerButtonContainer}>
                                <TouchableOpacity onPress={() => setScanning(false)}>
                                    <Text style={{ color: "#fff" }}>Close Scanner</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <FlatList
                        data={medications}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderMedicationItem}
                    />
                    <TouchableOpacity
                        style={[styles.finishButton, { backgroundColor: theme.colors.primary }]}
                        onPress={handleFinishInventory}
                    >
                        <Text style={styles.finishButtonText}>Finish Inventory</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    startButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    startButtonText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
    scanButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 16,
    },
    scanButtonText: { fontSize: 16, fontWeight: "600", color: "#ffffff" },
    medicationItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    medicationName: { fontSize: 20, fontWeight: "bold" },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: "auto",
    },
    button: {
        width: 40,
        height: 40,
        backgroundColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        marginHorizontal: 10,
    },
    buttonText: { fontSize: 22, fontWeight: "bold" },
    quantityText: { fontSize: 22, fontWeight: "bold" },
    finishButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    finishButtonText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
    scannerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    closeScannerButtonContainer: {
        position: "absolute",
        bottom: 20,
        alignSelf: "center",
        backgroundColor: "#000",
        borderRadius: 8,
        padding: 10,
    },
});
