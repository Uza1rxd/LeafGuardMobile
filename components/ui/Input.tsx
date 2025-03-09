import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Theme } from '../../constants/Theme';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  isPassword = false,
  secureTextEntry,
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getContainerStyles = (): ViewStyle => {
    return {
      marginBottom: Theme.spacing.md,
    };
  };

  const getLabelStyles = (): TextStyle => {
    return {
      fontSize: Theme.typography.fontSize.sm,
      fontWeight: '500',
      marginBottom: Theme.spacing.xs,
      color: Theme.colors.text.primary.light,
    };
  };

  const getInputContainerStyles = (): ViewStyle => {
    return {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error 
        ? Theme.colors.error 
        : Theme.colors.border.light,
      borderRadius: Theme.borderRadius.md,
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      paddingHorizontal: Theme.spacing.md,
    };
  };

  const getInputStyles = (): TextStyle => {
    return {
      flex: 1,
      paddingVertical: Theme.spacing.md,
      fontSize: Theme.typography.fontSize.md,
      color: Theme.colors.text.primary.light,
    };
  };

  const getErrorStyles = (): TextStyle => {
    return {
      fontSize: Theme.typography.fontSize.xs,
      color: Theme.colors.error,
      marginTop: Theme.spacing.xs,
    };
  };

  const getIconStyles = (): ViewStyle => {
    return {
      marginHorizontal: Theme.spacing.xs,
    };
  };

  return (
    <View style={[getContainerStyles(), containerStyle]}>
      {label && <Text style={[getLabelStyles(), labelStyle]}>{label}</Text>}
      <View style={getInputContainerStyles()}>
        {leftIcon && <View style={getIconStyles()}>{leftIcon}</View>}
        <TextInput
          style={[getInputStyles(), inputStyle]}
          placeholderTextColor={Theme.colors.text.disabled.light}
          secureTextEntry={isPassword ? !isPasswordVisible : secureTextEntry}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={togglePasswordVisibility} style={getIconStyles()}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={20}
              color={Theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && <View style={getIconStyles()}>{rightIcon}</View>}
      </View>
      {error && <Text style={[getErrorStyles(), errorStyle]}>{error}</Text>}
    </View>
  );
}; 