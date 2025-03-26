# xiaojusurvey-sdk-rn

xiaoju survey react-native SDK

## Installation

```sh
npm install xiaojusurvey-sdk-rn
```

## Usage


```js
import { Survey, ConfigProvider } from 'xiaojusurvey-sdk-rn';

Survey.init({
  host: '',
  port: 8080,
  appId: '',
  channelId: '',
});

Survey.show({
  activityId: '',
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
```


## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
