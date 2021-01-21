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
  const country = 'us';
  const category = 'sports';
  const apiKey = 'c32de463ef6544e7ad7edba84af91d52';
  const endpoint = `http://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`;
  const endpoint2 = 'https://www.boredapi.com/api/activity/';
  const [data, setData] = useState();
  const fetchData = async () => {
    try {
      let response = await fetch(endpoint2)
      let json = await response.json()
      setData(json)
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

  const activity = data.activity;
  const sendNotifications = () => {
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'Bored?',
      alertBody: activity,
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
