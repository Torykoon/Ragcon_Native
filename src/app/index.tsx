import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react'; // useEffect 추가
import { Image, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoLight from '../../assets/safe-logo.png';
import { useAppTheme } from '../contexts/app-theme-context';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function StartScreen() {
  const router = useRouter();
  const { isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // 2초(2000ms) 뒤에 실행될 타이머 설정
    const timer = setTimeout(() => {
      // replace를 사용하면 뒤로가기 시 다시 스플래시 화면으로 돌아오지 않습니다.
      router.replace('/(home)'); 
    }, 2000);

    // 컴포넌트가 언마운트(화면이 사라짐)될 때 타이머 정리 (메모리 누수 방지)
    return () => clearTimeout(timer);
  }, [router]);

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
      </View>
      
    </View>
  );
}