import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../components/app-text';
import { Button } from 'heroui-native';
// import { EquipmentSelect } from '../../../components/equipment-select';
import { HomeCard, type HomeCardProps } from '../../../components/HomeCard';
import { ScreenScrollView } from '../../../components/screen-scroll-view';
import { WorkInfoSelect } from '../../../components/work-info-select';
import { useWork } from '../../../contexts/work-context';
import { useRisk } from '../../../contexts/risk-context';

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
    path: '/risk/risk',
  },
  {
    title: '사고사례 검토',
    imageLight:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-themes-light.png',
    imageDark:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-themes-dark.png',
    count: 4,
    footer: '사고사례 검토를 진행합니다.',
    path: '/accident/accident',
  },
  {
    title: 'TBM 작성',
    imageLight:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-showcases-light.png',
    imageDark:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-showcases-dark-1.png',
    count: 5,
    footer: 'AI를 활용한 TBM 작성하기',
    path: '/tbm/tbm',
  },
];

export default function SafetyCheckScreen() {
  const { selectedWork, selectedEquipment } = useWork();
  const { refreshHazardFromProcess, refreshAccidentFromProcess, refreshTbmFromProcess, loading, acciLoading, tbmLoading, cancelAll } = useRisk();

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

      {/* 작업정보 및 사용장비 선택 영역 */}
      <View className="px-4 mb-6">
        <View className="gap-3">
          {/* 작업정보 선택 버튼 */}
          <View>
            <AppText className="text-sm text-muted mb-2">작업 정보</AppText>
            <WorkInfoSelect />
            {selectedWork && (
              <AppText className="text-xs text-muted mt-1">
                선택된 작업: {selectedWork.label}
              </AppText>
            )}
          </View>

          {/* 사용장비 선택 버튼 */}
          {/* <View>
            <AppText className="text-sm text-muted mb-2">사용 장비</AppText>
            <EquipmentSelect />
            {selectedEquipment && (
              <AppText className="text-xs text-muted mt-1">
                선택된 장비: {selectedEquipment.label}
              </AppText>
            )}
          </View> */}
          <Button onPress={() => {
            if (!(loading || acciLoading || tbmLoading)){
              refreshHazardFromProcess();
              refreshAccidentFromProcess();
              refreshTbmFromProcess();
            }
          }
          } className="mb-[30px]" >
            {loading || acciLoading || tbmLoading ? '생성 중...' : '안전점검활동 시작'}
          </Button>
          {(loading || acciLoading || tbmLoading) && (<Button 
              onPress={cancelAll}
              className="mb-[30px]"
              size="md"
              variant="destructive-soft"
            >{'생성 중지'}
            </Button>)
          }
        </View>
      </View>

      {/* 기존 카드들 */}
      <View className="gap-6">
        {safetyCheckCards
        .filter((card) => {
            if (card.title === '위험성 평가 작성') {
            return !loading;          // loading이 false일 때만 보여줌
          }
          if (card.title === '사고사례 검토') {
            return !acciLoading;      // acciLoading이 false일 때만
          }
          if (card.title === 'TBM 작성') {
            return !tbmLoading;       // tbmLoading이 false일 때만
          }
          return true;                // 나머지 카드는 항상 보여줌
        })
        .map((card, index) => (
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