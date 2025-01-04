import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import MedicationsScreen from './MedicationsScreen';
import InventoryScreen from './InventoryScreen';
import SettingsScreen from './SettingsScreen';
import LoggedOut from "./LoggedOut";
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';

const Tab = createBottomTabNavigator();

const Navigation: React.FC = () => {
    const { user, isLoading } = useAuth0();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [user]);

    return (
            <Tab.Navigator
                id={undefined}
                initialRouteName={isLoggedIn ? 'Home' : 'Logged out'}
                screenOptions={{
                    tabBarStyle: {
                        backgroundColor: 'white',
                        borderTopWidth: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.2)',
                        shadowOffset: { width: 0, height: -4 },
                        shadowRadius: 10,
                        shadowOpacity: 1,
                        elevation: 10,
                    },
                    tabBarActiveTintColor: '#3498db',
                    tabBarInactiveTintColor: 'black',
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
                        name="Medications"
                        component={MedicationsScreen}
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="medkit-outline" size={24} color={color} />,
                        }}
                    />
                    <Tab.Screen
                        name="Inventory"
                        component={InventoryScreen}
                        options={{
                            tabBarIcon: ({ color }) => <Ionicons name="cube-outline" size={24} color={color} />,
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
                            tabBarLabel: 'Logged out',
                            tabBarStyle: {
                                backgroundColor: 'white',
                                paddingBottom: 5,
                            },
                        }}
                    />
                )}
                </Tab.Navigator>
    );
};

export default Navigation;
