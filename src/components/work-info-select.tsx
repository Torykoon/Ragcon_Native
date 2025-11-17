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
import { useWork, type WorkInfo } from '../contexts/work-context';
import { AppText } from './app-text';
import { SelectBlurBackdrop } from './select/select-blur-backdrop';

KeyboardController.preload();

// 작업정보 목록
const WORK_ITEMS: WorkInfo[] = [
  { value: 'rebar', label: '철근작업' },
  { value: 'concrete', label: '콘크리트타설' },
  { value: 'scaffold', label: '비계설치' },
  { value: 'demolition', label: '해체작업' },
  { value: 'welding', label: '용접작업' },
  { value: 'painting', label: '도장작업' },
  { value: 'excavation', label: '굴착작업' },
  { value: 'formwork', label: '거푸집작업' },
  { value: 'steel', label: '철골작업' },
  { value: 'masonry', label: '조적작업' },
];

export function WorkInfoSelect() {
  const { selectedWork, setSelectedWork } = useWork();
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
        const work = WORK_ITEMS.find((w) => w.value === newValue?.value);
        setSelectedWork(work);
        setSearchQuery('');
      }}
      closeDelay={300}
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