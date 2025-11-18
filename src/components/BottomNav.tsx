// app/components/bottom-nav.tsx
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter, usePathname, type Href } from 'expo-router';
import { useThemeColor } from 'heroui-native';
import { MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons'; // expo 기본 아이콘

type NavItem = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  href: Href;
  matchPath: string;
};

const NAV_ITEMS: NavItem[] = [
  { icon: 'home-outline', label: '홈',      href: '/' as Href, matchPath: '/'},
  { icon: 'robot-excited-outline', label: 'AI',      href: '/(home)/chat' as Href, matchPath: '/chat'},
  { icon: 'list-box-outline', label: '안전진단', href: '/(home)/(safety)/safety-check' as Href, matchPath: '/safety-check'},
];

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const bg = useThemeColor('background');
  const themeColorMuted = useThemeColor('muted');
  const themeColorAccent = useThemeColor('accent');

  const activeColor = themeColorAccent; // 파란색 (원하는 색으로 바꿔도 됨)

  return (
    <View 
        style={[styles.wrapper,
            {
            backgroundColor: bg
            }
        ]} pointerEvents="box-none">
      <View
        style={[
          styles.container,
          {
            borderTopColor: '#0000001a',
          },
        ]}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.matchPath;

          return (
            <Pressable
              key={item.matchPath}
              style={styles.tab}
              onPress={() => router.push(item.href)}
              hitSlop={10}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={isActive ? activeColor : themeColorMuted}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 32,
    paddingBottom: 48,  // 필요하면 SafeArea 적용
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
