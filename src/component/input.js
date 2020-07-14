import React, {Component} from 'react';
import {TextInput as RNTextInput, StyleSheet} from 'react-native';
import {font} from './style';

const baseStyles = StyleSheet.create({
  input: {
    fontSize: font.sizeL,
    height: font.lineHeightL + 2 * 12,
    padding: 0,
  },
});

export class TextInput extends Component {
  render() {
    const {style, ...props} = this.props;
    return (
      <RNTextInput
        style={[baseStyles.input, style]}
        autoCorrect={false}
        autoCapitalize="none"
        underlineColorAndroid="rgba(0,0,0,0)"
        {...props}
      />
    );
  }
}
