import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  Dimensions,
  Keyboard,
} from 'react-native';
import type { EmitterSubscription } from 'react-native';
import { Portal } from '../components';
import { scale } from '../utils';
import { CardRender } from '../render/card-render';
import type { SurveyOptions } from '../constants/interface';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverly: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalStyle: {
    backgroundColor: '#fff',
    position: 'absolute',
    width: '100%',
    borderTopStartRadius: scale(24),
    borderTopEndRadius: scale(24),
  },
  headerWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  closeIcon: {
    marginVertical: scale(10),
    marginRight: scale(30),
  },
});

let key: number | null = null;

export class Modal extends React.Component<SurveyOptions, any> {
  static show(options: SurveyOptions) {
    if (!key) {
      key = Portal.add(<Modal {...options} />);
    }
  }

  static remove() {
    if (key) {
      Portal.remove(key);
      key = null;
    }
  }

  keyboardDidShowListener: EmitterSubscription | null = null;

  keyboardDidHideListener: EmitterSubscription | null = null;

  state = {
    keyboardHeight: 0,
  };

  componentDidMount(): void {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        this.setState({
          keyboardHeight: e.endCoordinates.height,
        });
      }
    );

    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        this.setState({
          keyboardHeight: 0,
        });
      }
    );
  }

  componentWillUnmount(): void {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
  }

  render(): React.ReactNode {
    const { type = 'card', onClose, onSubmit, onError } = this.props;
    const { keyboardHeight } = this.state;
    return (
      <Pressable onPress={() => Keyboard.dismiss()} style={styles.modalOverly}>
        <View
          style={[
            styles.modalStyle,
            {
              height: type === 'card' ? height * 0.4 : height * 0.8,
              top:
                type === 'card'
                  ? height * 0.6 - keyboardHeight * 0.5
                  : height * 0.2 - keyboardHeight * 0.5,
              paddingBottom: scale(50),
            },
          ]}
        >
          <CardRender
            {...this.props}
            container="modal"
            onError={(error: any) => {
              Modal.remove();
              onError && onError(error);
            }}
            onClose={() => {
              Modal.remove();
              onClose && onClose();
            }}
            onSubmit={(result: number) => {
              Modal.remove();
              onSubmit && onSubmit(result);
            }}
          />
        </View>
      </Pressable>
    );
  }
}
