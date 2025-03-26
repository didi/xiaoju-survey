/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Survey, ConfigProvider } from 'xiaojusurvey-sdk-rn';

export default function App(): React.JSX.Element {
  Survey.init({
    host: 'http://10.190.55.101',
    port: 8080,
    appId: '2bAppid',
    channelId: '67cecfb37b4d3ae83aea1bdb',
  });
  return (
    <ConfigProvider>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={1}
          onPress={() => {
            Survey.show({
              activityId: 'fuFxJhtF',
              onError: (error) => {
                console.log('问卷请求失败!', error);
              },
              onSuccess: () => {
                console.log('问卷请求成功!');
              },
              onClose: () => {
                console.log('用户关闭!');
              },
              onSubmit: (result) => {
                console.log('提交结果: ', result);
              },
            });
          }}
        >
          <Text style={styles.buttonText}>打开问卷111</Text>
        </TouchableOpacity>
      </View>
    </ConfigProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    borderRadius: 15,
    margin: 30,
    height: 42,
    backgroundColor: '#FAA600',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
