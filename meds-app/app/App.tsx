import React from 'react';
import Navigation from './Navigation';  // Adjust the path accordingly
import {useAuth0, Auth0Provider} from 'react-native-auth0';

const App = () => {
    return (
        <Auth0Provider domain={"medsapp.eu.auth0.com"} clientId={"sXWfXQWyWATHRcc94MO8aSSO6zIAFBpQ"}>
            <Navigation />
        </Auth0Provider>
    );
};

export default App;
