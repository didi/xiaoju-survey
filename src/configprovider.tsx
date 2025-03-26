import React, { createContext, useContext } from 'react';
import { Portal } from './components/index';
import type { ImageSourcePropType } from 'react-native';
export interface ConfigProviderProps {
  theme?: {
    themeColor: string; // 主色
    auxiliaryColor: string; // 辅色
    headerImage: ImageSourcePropType; // 头部背景图
  };
}

const defaultProps = {
  theme: {
    themeColor: '#FAA600',
    auxiliaryColor: '#FEF6E6',
    headerImage: require('./assets/survey_bg.png'),
  },
} as ConfigProviderProps;

export const defaultConfigRef: {
  current: ConfigProviderProps;
} = {
  current: {
    theme: {
      themeColor: '#FAA600',
      auxiliaryColor: '#FEF6E6',
      headerImage: require('./assets/survey_bg.png'),
    },
  },
};

export const setDefaultConfig = (config: ConfigProviderProps) => {
  defaultConfigRef.current = config;
};

export const getDefaultConfig = () => {
  return defaultConfigRef.current;
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  return context ? context : getDefaultConfig();
};

// 创建一个 Context 对象
const ConfigContext = createContext<ConfigProviderProps>(defaultProps);

export const ConfigProvider: React.FC<
  ConfigProviderProps & React.PropsWithChildren
> = (props) => {
  const { children, ...config } = { ...defaultProps, ...props };
  const parentConfig = useConfig();
  const value = {
    ...parentConfig,
    ...config,
  };
  return (
    <ConfigContext.Provider value={value}>
      <Portal.Host>{children}</Portal.Host>
    </ConfigContext.Provider>
  );
};

ConfigProvider.displayName = 'SurveyConfigProvider';
