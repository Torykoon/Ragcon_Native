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
import { useWork, type Equipment } from '../contexts/work-context';
import { AppText } from './app-text';
import { SelectBlurBackdrop } from './select/select-blur-backdrop';

KeyboardController.preload();

// 사용장비 목록
const EQUIPMENT_ITEMS: Equipment[] = [
  { value: 'crane', label: '크레인' },
  { value: 'forklift', label: '지게차' },
  { value: 'mixer', label: '콘크리트믹서' },
  { value: 'excavator', label: '굴착기' },
  { value: 'bulldozer', label: '불도저' },
  { value: 'loader', label: '로더' },
  { value: 'dump-truck', label: '덤프트럭' },
  { value: 'concrete-pump', label: '콘크리트펌프' },
  { value: 'tower-crane', label: '타워크레인' },
  { value: 'welding-machine', label: '용접기' },
];

export function EquipmentSelect() {
  const { selectedEquipment, setSelectedEquipment } = useWork();
  const [searchQuery, setSearchQuery] = useState('');

  const { isDark } = useAppTheme();

  const themeColorMuted = useThemeColor('muted');
  const themeColorOverlay = useThemeColor('overlay');
  const themeColorSurface = useThemeColor('surface');

  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const insetTop = insets.top + 12;
  const maxDialogHeight = (height - insetTop) / 2;

  const filteredEquipment = EQUIPMENT_ITEMS.filter((equipment) =>
    equipment.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Select
      value={selectedEquipment}
      onValueChange={(newValue) => {
        const equipment = EQUIPMENT_ITEMS.find((e) => e.value === newValue?.value);
        setSelectedEquipment(equipment);
        setSearchQuery('');
      }}
      closeDelay={300}
    >
      <Select.Trigger asChild>
        <Button variant="tertiary" className="min-w-32">
          {selectedEquipment ? (
            <AppText className="text-sm text-accent font-medium">
              {selectedEquipment.label}
            </AppText>
          ) : (
            <AppText className="text-accent">사용장비 선택</AppText>
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
              <Select.ListLabel>장비 선택</Select.ListLabel>
              <Select.Close />
            </View>
            <View className="w-full mb-2">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="장비명 검색..."
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
                {filteredEquipment.map((equipment) => (
                  <Select.Item
                    key={equipment.value}
                    value={equipment.value}
                    label={equipment.label}
                  >
                    <View className="flex-row items-center gap-3 flex-1">
                      <AppText className="text-base text-foreground flex-1">
                        {equipment.label}
                      </AppText>
                    </View>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
                {filteredEquipment.length === 0 && (
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