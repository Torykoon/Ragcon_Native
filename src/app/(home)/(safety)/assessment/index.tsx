import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components/app-text';
import { ScreenScrollView } from '../../../../components/screen-scroll-view';

export default function AssessmentScreen() {
  return (
    <ScreenScrollView>
      <View className="flex-1 items-center justify-center">
        <AppText className="text-2xl font-semibold text-foreground">
          위험성 평가 작성
        </AppText>
        <AppText className="text-lg text-muted mt-2">
          AI를 활용한 위험성 평가 작성 페이지입니다.
        </AppText>
      </View>
    </ScreenScrollView>
  );
}