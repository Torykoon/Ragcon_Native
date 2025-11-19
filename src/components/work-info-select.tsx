import { LinearGradient } from 'expo-linear-gradient';
import { Button, cn, ScrollShadow, Select, useThemeColor } from 'heroui-native';
import { useState } from 'react';
import { TextInput, useWindowDimensions, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
  KeyboardAvoidingView,
  KeyboardController,
} from 'react-native-keyboard-controller';
import { Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../contexts/app-theme-context';
import { useRisk } from '../contexts/risk-context';
import { useWork, type WorkInfo } from '../contexts/work-context';
import { AppText } from './app-text';
import { SelectBlurBackdrop } from './select/select-blur-backdrop';

KeyboardController.preload();

// 작업정보 목록
const WORK_ITEMS: WorkInfo[] = [
  { value: '01', label: '기계설비공사 > 배관공사 > 강관 > 용접접합' },
  { value: '02', label: '기계설비공사 > 보온공사 > 발열선 > 분전함 설치' },
  { value: '03', label: '기계설비공사 > 기타공사 > 도장 > 유성페인트 칠' },
  { value: '04', label: '기계설비공사 > 자동제어설비공사 > 자동제어기기 > 도압배관' },
  { value: '05', label: '기계설비공사 > 자동제어설비공사 > 전선배선 > 중앙처리장치(CPU) 설치' },
  { value: '06', label: '기계설비공사 > 플랜트설비공사 > 플랜트 배관 > 플랜트 배관 설치' },
  { value: '07', label: '기계설비공사 > 플랜트설비공사 > 강재 제작 설치 > 철골 가공조립' },
  { value: '08', label: '기계설비공사 > 플랜트설비공사 > 강재 제작 설치 > 도장 및 방청공사' },
  { value: '09', label: '건축공사 > 조적공사 > 벽돌 > 벽돌 쌓기' },
  { value: '10', label: '건축공사 > 타일공사 > 타일 붙임 > 접착 붙이기' },
  { value: '11', label: '건축공사 > 칠공사 > 페인트 > 수성페인트 붓칠' },
];

export function WorkInfoSelect() {
  const { selectedWork, setSelectedWork } = useWork();
  const { setProcess, loading, acciLoading, tbmLoading } = useRisk();
  const [searchQuery, setSearchQuery] = useState('');

  const { isDark } = useAppTheme();

  const themeColorMuted = useThemeColor('muted');
  const themeColorOverlay = useThemeColor('overlay');
  const themeColorSurface = useThemeColor('surface');

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const insetTop = insets.top + 12;
  const maxDialogHeight = (height - insetTop) / 2;

  const filteredWorks = WORK_ITEMS.filter((work) =>
    work.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Select
      value={selectedWork}
      onValueChange={(newValue) => {
        if (loading || acciLoading || tbmLoading) return;
        const work = WORK_ITEMS.find((w) => w.value === newValue?.value);
        setSelectedWork(work);
        setProcess(work?.label?? '');
        setSearchQuery('');
      }}
      closeDelay={300}
      isDisabled={loading || acciLoading || tbmLoading}
    >
      <Select.Trigger asChild>
        <Button variant="tertiary" className="min-w-32">
          {selectedWork ? (
            <AppText className="text-sm text-accent font-medium">
              {selectedWork.label}
            </AppText>
          ) : (
            <AppText className="text-accent">작업정보 선택</AppText>
          )}
        </Button>
      </Select.Trigger>
      <Select.Portal
        progressAnimationConfigs={{
          onClose: {
            animationType: 'timing',
            animationConfig: {
              duration: 250,
              easing: Easing.out(Easing.quad),
            },
          },
        }}
      >
        <Select.Overlay className="bg-transparent" isDefaultAnimationDisabled>
          <SelectBlurBackdrop />
        </Select.Overlay>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={24}>
          <Select.Content
            classNames={{
              wrapper: 'justify-center',
              content: cn('gap-2 rounded-3xl', isDark && 'bg-surface'),
            }}
            style={{ marginTop: insetTop, height: maxDialogHeight }}
            presentation="dialog"
          >
            <View className="flex-row items-center justify-between mb-2">
              <Select.ListLabel>작업 선택</Select.ListLabel>
              <Select.Close />
            </View>
            <View className="w-full mb-2">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="작업명 검색..."
                placeholderTextColor={themeColorMuted}
                className="p-3 rounded-xl bg-surface-secondary/80 text-foreground"
                autoFocus
              />
            </View>
            <ScrollShadow
              className="flex-1"
              LinearGradientComponent={LinearGradient}
              color={isDark ? themeColorSurface : themeColorOverlay}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                {filteredWorks.map((work) => (
                  <Select.Item
                    key={work.value}
                    value={work.value}
                    label={work.label}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <AppText className="text-base text-foreground flex-1">
                        {work.label}
                      </AppText>
                    </View>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
                {filteredWorks.length === 0 && (
                  <AppText className="text-muted text-center mt-8">
                    검색 결과가 없습니다
                  </AppText>
                )}
              </ScrollView>
            </ScrollShadow>
          </Select.Content>
        </KeyboardAvoidingView>
      </Select.Portal>
    </Select>
  );
}