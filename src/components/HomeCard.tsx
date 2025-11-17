import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, cn } from 'heroui-native';
import React, { type FC } from 'react';
import { Image, Pressable, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  withTiming
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { useAppTheme } from '../contexts/app-theme-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);
const StyledFeather = withUniwind(Feather);

export type HomeCardProps = {
  title: string;
  imageLight: string;
  imageDark: string;
  count: number;
  footer: string;
  path: string;
};

export const HomeCard: FC<HomeCardProps & { index: number }> = ({
  title,
  imageLight,
  imageDark,
  count,
  footer,
  path,
  index,
}) => {
  const router = useRouter();
  const { isDark } = useAppTheme();

  const rLightImageStyle = useAnimatedStyle(() => {
    return {
      opacity: isDark ? 0 : withTiming(0.4),
    };
  });

  const rDarkImageStyle = useAnimatedStyle(() => {
    return {
      opacity: isDark ? withTiming(0.4) : 0,
    };
  });

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300)
        .delay(index * 100)
        .easing(Easing.out(Easing.ease))}
      onPress={() => router.push(path)}
    >
      <Card
        className={cn(
          'p-0 border border-zinc-200',
          isDark && 'border-zinc-900'
        )}
      >
        <AnimatedView
          entering={FadeIn}  // ✅ 이제 정상 작동합니다
          className="absolute inset-0 w-full h-full"
        >
          <AnimatedImage
            source={{ uri: imageLight }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
            style={rLightImageStyle}
          />
          <AnimatedImage
            source={{ uri: imageDark }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
            style={rDarkImageStyle}
          />
        </AnimatedView>
        <View className="gap-4">
          <Card.Body className="h-5" />
          <Card.Footer className="px-3 pb-3 flex-row items-end gap-4">
            <View className="flex-1">
              <Card.Title className="text-2xl text-foreground/85">
                {title}
              </Card.Title>
              <Card.Description className="text-foreground/65 pl-0.5">
                {footer}
              </Card.Description>
            </View>
            <View className="size-9 rounded-full bg-background/25 items-center justify-center">
              <StyledFeather
                name="arrow-up-right"
                size={20}
                className="text-foreground"
              />
            </View>
          </Card.Footer>
        </View>
      </Card>
    </AnimatedPressable>
  );
};