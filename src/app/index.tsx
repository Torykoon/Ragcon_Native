import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Button, useThemeColor } from 'heroui-native';
import { Image, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoLight from '../../assets/ragcon_icon.png';
import { AppText } from '../components/app-text';
import { useAppTheme } from '../contexts/app-theme-context';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function StartScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const themeColorBackground = useThemeColor('background');
  const insets = useSafeAreaInsets();

  return (
    <View 
      className="flex-1 items-center justify-center bg-background p-6"
      style={{ paddingBottom: Math.max(insets.bottom, 24) }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View className="flex-1 items-center justify-center gap-6">
        <AnimatedImage
          entering={FadeIn.duration(1000)}
          source={LogoLight}
          className="w-70 h-70"
          resizeMode="contain"
        />
        <Animated.View entering={FadeInDown.duration(800).delay(200)}>
          <AppText className="text-3xl font-bold text-foreground text-center">
            Ragcon Native에 오신 것을 환영합니다
          </AppText>
        </Animated.View>
        <Animated.View entering={FadeInDown.duration(800).delay(400)}>
          <AppText className="text-lg text-muted text-center">
            건설현장 AI 시스템 데모
          </AppText>
        </Animated.View>
      </View>
      
      <Animated.View 
        className="w-full"
        entering={FadeInDown.duration(800).delay(600)}
      >
        <Button
          size="lg"
          onPress={() => router.push('/(home)')}
        >
          <Button.Label>시작하기</Button.Label>
        </Button>
      </Animated.View>
    </View>
  );
}