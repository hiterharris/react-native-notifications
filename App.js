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
  const [data, setData] = useState();
  const [newStory, setNewStory] = useState();
  const fetchData = async () => {
    try {
      let response = await fetch(endpoint)
      let json = await response.json()
      setData(json.articles)
    } catch(error) {
      console.log('error: ', error);
    }
  }

  useEffect(() => {
    fetchData()
    setNewStory(data[0])
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
      alertTitle: 'New Story',
      alertBody: newStory.description,
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
