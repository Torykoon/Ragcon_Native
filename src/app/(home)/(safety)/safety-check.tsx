import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../components/app-text'; // AppText 임포트
import { HomeCard, type HomeCardProps } from '../../../components/HomeCard';
import { ScreenScrollView } from '../../../components/screen-scroll-view'; // ScreenScrollView 임포트

// '안전 점검' 화면에 표시할 카드 데이터
const safetyCheckCards: HomeCardProps[] = [
  {
    title: '위험성 평가 작성',
    imageLight:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-components-light.png',
    imageDark:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-components-dark.png',
    count: 20,
    footer: 'AI를 활용한 위험성 평가 작성하기',
    path: 'assessment', 
  },
  {
    title: '사고사례 검토',
    imageLight:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-themes-light.png',
    imageDark:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-themes-dark.png',
    count: 4,
    footer: '사고사례 검토를 진행합니다.',
    path: 'cases', 
  },
  {
    title: 'TBM 작성',
    imageLight:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-showcases-light.png',
    imageDark:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-showcases-dark-1.png',
    count: 5,
    footer: 'AI를 활용한 TBM 작성하기',
    path: 'tbm', 
  },
];

export default function SafetyCheckScreen() {
  return (
    <ScreenScrollView>
      <View className="items-center justify-center my-4">
        <AppText className="text-2xl font-semibold text-foreground">
          안전 점검
        </AppText>
        <AppText className="text-lg text-muted mt-2">
          수행할 작업을 선택하세요.
        </AppText>
      </View>

      <View className="gap-6">
        {safetyCheckCards.map((card, index) => (
          <HomeCard
            key={card.title}
            title={card.title}
            imageLight={card.imageLight}
            imageDark={card.imageDark}
            count={card.count}
            footer={card.footer}
            path={card.path}
            index={index}
          />
        ))}
      </View>
    </ScreenScrollView>
  );
}