import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleProp, ViewStyle} from 'react-native';

type Props = {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

export const AnimatedEntrance = ({children, delay = 0, style}: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 460,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{translateY}],
        },
      ]}>
      {children}
    </Animated.View>
  );
};
