import { View as DefaultView } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemeProps } from './ThemedText';

export type ViewProps = ThemeProps & DefaultView['props'];

export default function ThemedView(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
