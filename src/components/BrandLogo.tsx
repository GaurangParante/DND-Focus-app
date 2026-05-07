import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

export const BrandLogo = ({size = 180}: {size?: number}) => {
  return (
    <View style={[styles.frame, {width: size, height: size}]}>
      <Image
        source={require('../../assets/branding/focusshield-icon-master.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
