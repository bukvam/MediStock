import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import {Camera, CameraView} from "expo-camera";

export default function TestScreen2() {
    const [scanning, setScanning] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [currentMedication, setCurrentMedication] = useState({
        id: null,
        name: "",
        quantity_in_stock: 0,
        barcode: "",
    });

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        };
        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanning(false);
        console.log(data);
        setCurrentMedication((prev) => ({ ...prev, barcode: data }));
    };

    if (hasPermission === null) {
        return <Text>Requesting camera permission...</Text>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera. Please enable camera permissions in your device settings.</Text>;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setScanning(true)}>
                <Text>Scan Barcode</Text>
            </TouchableOpacity>

            {/* Barcode Scanner Modal */}
            {scanning && (
                <Modal visible={scanning} animationType="slide" transparent>
                    <View style={styles.fullScreenModal}>
                        <CameraView
                            onBarCodeScanned={handleBarCodeScanned}
                            barcodeScannerSettings={{
                                barcodeTypes: [
                                    "qr",
                                    "pdf417",
                                    "upc_a",
                                    "upc_e",
                                    "ean13",
                                    "ean8",
                                ],
                            }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <TouchableOpacity
                            style={styles.closeScannerButton}
                            onPress={() => setScanning(false)}
                        >
                            <Text style={styles.closeScannerButtonText}>Close Scanner</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreenModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    closeScannerButton: {
        position: "absolute",
        top: 30,
        right: 20,
        padding: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderRadius: 5,
    },
    closeScannerButtonText: {
        color: "#fff",
        fontSize: 16,
    },
});
