import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const App = () => {
  const endpoint = 'https://api.covidtracking.com/v1/us/current.json';
  const [data, setData] = useState();
  const fetchData = async () => {
    try {
      let response = await fetch(endpoint)
      let json = await response.json()
      setData(json[0])
    } catch(error) {
      console.log('error: ', error);
    }
  }

  useEffect(() => {
    fetchData()
  }, [0])


  useEffect(() => {
    PushNotificationIOS.addEventListener('register', onRegistered);
    PushNotificationIOS.addEventListener('registrationError', onRegistrationError);
    PushNotificationIOS.requestPermissions().then(
      (data) => {
        console.log('PushNotificationIOS.requestPermissions', data);
      },
      (data) => {
        console.log('PushNotificationIOS.requestPermissions failed', data);
      },
    );
  }, []);
  
  const onRegistered = (deviceToken) => {
    console.log('Token: ' + deviceToken);
  };

  const onRegistrationError = (error) => {
    Alert.alert(
        'Failed To Register For Remote Push',
        `Error (${error.code}): ${error.message}`,
        [
        {
            text: 'Dismiss',
            onPress: null,
        },
        ],
    );
  };

  const sendNotifications = () => {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'Positive Case Increase Today',
      alertBody: increase,
    });
  };

  const scheduleNotifications = () => {
    PushNotificationIOS.scheduleLocalNotification({
      alertTitle: 'Positive Case Increase Today',
      alertBody: increase,
      // fireDate: Date.now(),
      // repeatInterval: 'hour'
    });
  };

  return (
    <View style={styles.App}>
      <StatusBar barStyle="dark-content" />
      <Button title='Notification' onPress={sendNotifications} />
    </View>
  );
};

const styles = StyleSheet.create({
  App: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default App;
