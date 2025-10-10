import { StyleSheet } from 'react-native';
import { scale } from '../utils';

export default (theme: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      borderTopStartRadius: scale(24),
      borderTopEndRadius: scale(24),
    },
    bottomBtn: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: scale(80),
      paddingHorizontal: scale(44),
    },
    btn: {
      width: scale(148),
      height: scale(64),
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: scale(8),
    },
    prevBorder: {
      borderWidth: scale(1),
      borderColor: '#434343',
      marginRight: scale(32),
    },
    prevText: {
      color: '#434343',
    },
    activeBorder: {
      borderWidth: scale(1),
      borderColor: theme.themeColor,
    },
    activeText: {
      color: theme.themeColor,
    },
    loadingWrap: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerImage: {
      width: '100%',
      height: scale(144),
    },
    headerWrap: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: scale(144),
      paddingHorizontal: scale(24),
    },
    titleWrap: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    title: {
      fontSize: scale(32),
      lineHeight: scale(38),
      marginRight: scale(5),
      marginBottom: scale(5),
    },
    closeIcon: {
      flexShrink: 1,
      marginLeft: scale(10),
      marginVertical: scale(10),
    },
    questionWrap: {
      flex: 1,
      paddingHorizontal: scale(24),
    },
    tagWrap: {
      borderWidth: StyleSheet.hairlineWidth,
      borderBottomLeftRadius: scale(8),
      borderTopRightRadius: scale(8),
      borderColor: theme!.themeColor,
      paddingHorizontal: scale(15),
      backgroundColor: theme!.auxiliaryColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tagText: {
      color: theme!.themeColor,
    },
  });
};
