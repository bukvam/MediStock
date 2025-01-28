import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from './AuthContext';
import HomeScreen from './HomeScreen';
import MedicationsScreen from './MedicationsScreen2';
import InventoryScreen from './InventoryScreen';
import AddMedication from './AddMedication';
import SettingsScreen from './SettingsScreen';
import LoggedOut from "./LoggedOut";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
// @ts-ignore
import PillDark from "../assets/pill-dark.svg";
// @ts-ignore
import PillWhite from "../assets/pill-white.svg";

const Tab = createBottomTabNavigator();

const Navigation: React.FC = () => {
    const { theme, isDarkMode } = useTheme();
    const ImageComponent = isDarkMode ? PillWhite : PillDark;
    const { isLoggedIn } = useAuth();

    return (
            <Tab.Navigator
                id={undefined}
                initialRouteName={isLoggedIn ? 'Home' : 'Logged out'}
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: theme.colors.background,
                        borderTopWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowOffset: { width: 0, height: -4 },
                        shadowRadius: 10,
                        shadowOpacity: 1,
                        elevation: 10,
                    },
                    tabBarActiveTintColor: theme.colors.primary, // Use theme primary color for active tab
                    tabBarInactiveTintColor: theme.colors.text, // Use theme text color for inactive tabs
                    tabBarLabelStyle: {
                        fontSize: 14,
                        fontWeight: 'bold',
                    },
                }}
            >
                {isLoggedIn ? (
                    <>
                        <Tab.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{
                                tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
                            }}
                        />
                        <Tab.Screen
                            name="Meds"
                            component={MedicationsScreen}
                            options={{
                                tabBarIcon: ({ color }) =>  <ImageComponent size={24} color={color}/>,
                            }}
                        />
                        <Tab.Screen
                            name="Add"
                            component={AddMedication}
                            options={{
                                tabBarIcon: ({ color }) => <Ionicons name="add-outline" size={24} color={color} />
                            }}
                        />
                        <Tab.Screen
                            name="Inventory"
                            component={InventoryScreen}
                            options={{
                                tabBarIcon: ({ color }) => <Ionicons name="barcode-outline" size={24} color={color} />,
                            }}
                        />
                        <Tab.Screen
                            name="Settings"
                            component={SettingsScreen}
                            options={{
                                tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
                            }}
                        />
                    </>
                ) : (
                    <Tab.Screen
                        name="Logged out"
                        component={LoggedOut}
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="log-in-outline" size={24} color={color}/>,
                            tabBarLabel: 'Log in',
                        }}
                    />
                )}
            </Tab.Navigator>
    );
};

export default Navigation;
