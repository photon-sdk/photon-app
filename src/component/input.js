import React, {Component} from 'react';
import {TextInput as RNTextInput, StyleSheet} from 'react-native';

const baseStyles = StyleSheet.create({
  input: {
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
