import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components/app-text';
import { ScreenScrollView } from '../../../../components/screen-scroll-view';

export default function CasesScreen() {
  return (
    <ScreenScrollView>
      <View className="flex-1 items-center justify-center">
        <AppText className="text-2xl font-semibold text-foreground">
          사고사례 검토
        </AppText>
        <AppText className="text-lg text-muted mt-2">
          사고사례 검토를 진행하는 페이지입니다.
        </AppText>
      </View>
    </ScreenScrollView>
  );
}