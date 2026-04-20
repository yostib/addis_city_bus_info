import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { AppColors } from "../constants/theme";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function AnimatedCard({
  children,
  onPress,
  style,
  gradientColors,
  shadowLevel = "medium",
  scaleEffect = true,
  ...props
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    if (scaleEffect) {
      scale.value = withSpring(0.95, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    if (scaleEffect) {
      scale.value = withSpring(1, { damping: 15 });
    }
  };

  const cardContent = (
    <AnimatedTouchable
      style={[
        styles.card,
        AppColors.shadows[shadowLevel],
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={scaleEffect ? 1 : 0.7}
      {...props}
    >
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </AnimatedTouchable>
  );

  return cardContent;
}

export function FadeInView({ children, delay = 0, duration = 500, style }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration });
      translateY.value = withTiming(0, { duration });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}

export function SlideInView({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  style,
}) {
  const translateX = useSharedValue(
    direction === "left" ? -50 : direction === "right" ? 50 : 0,
  );
  const translateY = useSharedValue(
    direction === "up" ? 50 : direction === "down" ? -50 : 0,
  );
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration });
      translateX.value = withTiming(0, { duration });
      translateY.value = withTiming(0, { duration });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, direction]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
  );
}

export function LoadingSpinner({ size = 40, color = AppColors.primary }) {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    const animate = () => {
      rotation.value = withTiming(
        rotation.value + 360,
        { duration: 1000 },
        () => {
          runOnJS(animate)();
        },
      );
    };
    animate();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[styles.spinner, { width: size, height: size }, animatedStyle]}
    >
      <View style={[styles.spinnerRing, { borderColor: color }]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: AppColors.surface,
  },
  gradient: {
    flex: 1,
    padding: 16,
  },
  spinner: {
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerRing: {
    width: "100%",
    height: "100%",
    borderWidth: 3,
    borderRadius: 50,
    borderTopColor: "transparent",
  },
});
