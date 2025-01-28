import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Alert,
    Button
} from "react-native";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchMedications, updateMedication } from "./supabase";
import { useTheme } from "./ThemeContext";
import PillDark from "../assets/pill-dark.svg";
import PillWhite from "../assets/pill-white.svg";

export default function MedicationsScreen2() {
    const { theme, isDarkMode } = useTheme();
    const [medications, setMedications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMedication, setSelectedMedication] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const navigation = useNavigation();


    useFocusEffect(
        React.useCallback(() => {
            const loadMedications = async () => {
                const data = await fetchMedications();
                const sortedMedications = data.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setMedications(sortedMedications);
            };

            loadMedications();
        }, [])
    );


    const handleAddMedication = () => {
        navigation.navigate('Add');
    };

    const handleMedicationClick = (medication) => {
        setSelectedMedication(medication);
        setQuantity(medication.quantity_in_stock); // Set initial quantity from medication
        setModalVisible(true);
    };

    const handleIncrease = async () => {
        const newQuantity = quantity + 1;
        try {
            await updateMedication(selectedMedication.id, newQuantity);
            setQuantity(newQuantity);
        } catch (error) {
            Alert.alert("Error", "Failed to update quantity");
        }
    };

    const handleDecrease = async () => {
        if (quantity > 0) {
            const newQuantity = quantity - 1;
            try {
                await updateMedication(selectedMedication.id, newQuantity);
                setQuantity(newQuantity);
            } catch (error) {
                Alert.alert("Error", "Failed to update quantity");
            }
        } else {
            Alert.alert("Error", "Quantity cannot be less than 0");
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Medications</Text>
            <FlatList
                data={medications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                    const ImageComponent = isDarkMode ? PillWhite : PillDark;
                    return (
                        <TouchableOpacity onPress={() => handleMedicationClick(item)}>
                            <View style={styles.medicationItem}>
                                <View style={styles.pillImageContainer}>
                                    <ImageComponent width={50} height={50} />
                                </View>
                                <Text style={[styles.medicationName, { color: theme.colors.text }]}>
                                    {item.name}
                                </Text>
                                <View style={styles.medicationQuantityContainer}>
                                    <Text style={[styles.medicationQuantity, { color: theme.colors.primary }]}>
                                        {item.quantity_in_stock}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleAddMedication}
            >
                <Text style={styles.addButtonText}>Add Medication</Text>
            </TouchableOpacity>

            {/* Modal for updating medication quantity */}
            {selectedMedication && (
                <Modal
                    visible={modalVisible}
                    animationType="fade"
                    transparent={false}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                            {selectedMedication.name}
                        </Text>
                        <Text style={[styles.modalQuantity, { color: theme.colors.primary }]}>
                            {quantity}
                        </Text>

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity onPress={handleIncrease} style={[styles.modalButton, { backgroundColor: theme.colors.secondary }]}>
                                <Text style={styles.actionButtonsText}>+</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleDecrease} style={[styles.modalButton, { backgroundColor: theme.colors.error }]}>
                                <Text style={styles.actionButtonsText}>-</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalCloseButton, { backgroundColor: theme.colors.primary }]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 30, fontWeight: "700", marginBottom: 20 }, // increased font weight
    medicationItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
    },
    pillImageContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        borderRadius: 50,
        padding: 10,
        marginRight: 15,
    },
    medicationName: { fontSize: 24, fontWeight: "700" }, // increased font weight
    medicationQuantityContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    medicationQuantity: {
        fontSize: 28, // increased font size
        fontWeight: "700", // increased font weight
    },
    addButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    addButtonText: { fontSize: 20, fontWeight: "700", color: "#fff" }, // increased font weight

    // Modal styles for full-screen modal
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalTitle: { fontSize: 50, fontWeight: "700" }, // increased font weight
    modalQuantity: { fontSize: 40, marginVertical: 20, fontWeight: "700" }, // increased font weight
    modalButtonsContainer: { flexDirection: "row" },
    modalButton: {
        width: 70,
        height: 70,
        borderRadius: 15,
        margin: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    modalCloseButton: {
        padding: 15,
        marginTop: 20,
        backgroundColor: "#ccc",
        borderRadius: 5,
    },
    buttonText: { color: "#fff", fontSize: 28, fontWeight: "700" },
    actionButtonsText: { color: "#fff", fontSize: 40, fontWeight: "700" }
});
