import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Avatar, Card, cn, Surface } from 'heroui-native';
import type { FC } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { AppText } from '../../components/app-text';
import { HomeCard, type HomeCardProps } from '../../components/HomeCard';
import { ScreenScrollView } from '../../components/screen-scroll-view';
import { useAppTheme } from '../../contexts/app-theme-context';

// 안전지수 데이터 타입
type SafetyIndexData = {
  time: string;
  safeValue: number; // 0-10
  dangerValue: number; // 0-10
};

// 위험성 평가 레벨 타입
type RiskLevel = 'low' | 'medium' | 'high';

// 위험성 평가 일별 데이터
type DailyRiskData = {
  date: string;
  level: RiskLevel;
};

// 안전지수 더미 데이터 (시간대별)
const safetyIndexData: SafetyIndexData[] = [
  { time: '00:00', safeValue: 8, dangerValue: 2 },
  { time: '04:00', safeValue: 7, dangerValue: 3 },
  { time: '08:00', safeValue: 5, dangerValue: 5 },
  { time: '12:00', safeValue: 6, dangerValue: 4 },
  { time: '16:00', safeValue: 4, dangerValue: 6 },
  { time: '20:00', safeValue: 7, dangerValue: 3 },
];

// 위험성 평가 더미 데이터 (최근 7일)
const riskAssessmentData: DailyRiskData[] = [
  { date: '월', level: 'low' },
  { date: '화', level: 'medium' },
  { date: '수', level: 'medium' },
  { date: '목', level: 'high' },
  { date: '금', level: 'medium' },
  { date: '토', level: 'low' },
  { date: '일', level: 'low' },
];

const cards: HomeCardProps[] = [
  {
    title: 'AI 도우미',
    imageLight:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-components-light.png',
    imageDark:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-components-dark.png',
    count: 1,
    footer: '건설전문 AI 챗봇과 대화하기',
    path: 'chat',
  },
  {
    title: '안전점검시작',
    imageLight:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-showcases-light.png',
    imageDark:
      'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/images/heroui-native-example/home-showcases-dark-1.png',
    count: 3, 
    footer: '위험성 평가, 사고사례 검토, TBM 작성',
    path: 'safety-check', 
  },
];

// Favorite 항목 타입 정의
type FavoriteItemData = {
  id: string;
  imageUrl: string;
  label: string;
};

// Favorite 항목 데이터
const favorites: FavoriteItemData[] = [
  {
    id: '1',
    imageUrl: 'https://cdn.pixabay.com/photo/2022/03/27/15/03/crane-7095357_1280.jpg',
    label: '넘어짐사고',
  },
  {
    id: '2',
    imageUrl: 'https://cdn.pixabay.com/photo/2018/01/25/23/00/man-3107306_1280.jpg',
    label: '끼임/협착사고',
  },
  {
    id: '3',
    imageUrl: 'https://cdn.pixabay.com/photo/2021/11/11/22/08/welding-6787370_1280.jpg',
    label: '화상/화재사고',
  },
  {
    id: '4',
    imageUrl: 'https://cdn.pixabay.com/photo/2017/04/19/19/04/table-saw-2243289_1280.jpg',
    label: '베임 사고',
  },
  {
    id: '5',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
    label: '더미',
  },
  {
    id: '6',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
    label: '더미',
  },
];

type FavoriteItemProps = {
  data: FavoriteItemData;
};

const FavoriteItem: FC<FavoriteItemProps> = ({ data }) => {
  const router = useRouter();

  return (
    <Pressable
      className="items-center justify-center gap-2 px-2"
      onPress={() => router.push('accident')}
    >
      <Avatar size="lg" className="bg-transparent">
        <Avatar.Image source={{ uri: data.imageUrl }} />
        <Avatar.Fallback>
          <AppText className="text-sm font-medium">
            {data.label.substring(0, 2).toUpperCase()}
          </AppText>
        </Avatar.Fallback>
      </Avatar>
      <AppText className="text-xs text-foreground/85 text-center" numberOfLines={1}>
        {data.label}
      </AppText>
    </Pressable>
  );
};

// 안전지수 카드 컴포넌트
const SafetyIndexCard: FC = () => {
  const router = useRouter();
  const { isDark } = useAppTheme();

  // AI 추의 수치 계산 (위험값의 합)
  const aiCount = safetyIndexData.reduce((sum, item) => sum + item.dangerValue, 0);

  return (
    <Pressable onPress={() => router.push('/safety-index')}>
      <Card className={cn('p-4 h-[240px]', isDark && 'bg-surface-secondary')}>
        <View className="flex-1 justify-between">
          {/* 헤더 */}
          <View className="flex-row items-center justify-between mb-3">
            <AppText className="text-sm font-semibold text-foreground">
              오늘의 안전 지수
            </AppText>
            <MaterialCommunityIcons
              name="arrow-top-right"
              size={18}
              color={isDark ? '#a1a1aa' : '#71717a'}
            />
          </View>

          {/* 지수 정보 */}
          <View className="mb-3">
            <AppText className="text-xs text-muted mb-1">금일</AppText>
            <View className="flex-row items-baseline gap-1">
              <AppText className="text-xs text-foreground">AI 추의 수치:</AppText>
              <AppText className="text-s font-bold text-danger">{aiCount}</AppText>
            </View>
          </View>

          {/* 그래프 영역 - 고정 높이 */}
          <View className="h-20 flex-row items-end justify-between gap-0.5 mb-3">
            {safetyIndexData.map((item, index) => {
              // 안전값과 위험값에 따라 높이 계산
              const maxValue = 10;
              const safeHeightPercent = (item.safeValue / maxValue) * 100;
              const dangerHeightPercent = (item.dangerValue / maxValue) * 100;

              return (
                <View key={index} className="flex-1 h-full justify-end">
                  {/* 막대 그래프 컨테이너 */}
                  <View className="w-full h-full justify-end gap-px">
                    {/* 위험 수치 (빨간색) - 위에 배치 */}
                    {item.dangerValue > 0 && (
                      <View
                        className="w-full bg-danger rounded-t-sm"
                        style={{ height: `${dangerHeightPercent}%` }}
                      />
                    )}
                    {/* 안전 수치 (초록색) - 아래에 배치 */}
                    {item.safeValue > 0 && (
                      <View
                        className="w-full bg-success rounded-b-sm"
                        style={{ height: `${safeHeightPercent}%` }}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* 범례 */}
          <View className="flex-row items-center justify-center gap-3">
            <View className="flex-row items-center gap-1">
              <View className="w-2.5 h-2.5 rounded-full bg-success" />
              <AppText className="text-[10px] text-muted">안전지수</AppText>
            </View>
            <View className="flex-row items-center gap-1">
              <View className="w-2.5 h-2.5 rounded-full bg-danger" />
              <AppText className="text-[10px] text-muted">위험지수</AppText>
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};

// 위험성 평가 카드 컴포넌트
const RiskAssessmentCard: FC = () => {
  const router = useRouter();
  const { isDark } = useAppTheme();

  // 레벨에 따른 색상 및 텍스트 반환
  const getLevelInfo = (level: RiskLevel) => {
    switch (level) {
      case 'low':
        return { color: 'bg-success', text: '낮음', textColor: 'text-success' };
      case 'medium':
        return { color: 'bg-warning', text: '보통', textColor: 'text-warning' };
      case 'high':
        return { color: 'bg-danger', text: '높음', textColor: 'text-danger' };
    }
  };

  // 오늘의 위험성 (마지막 항목)
  const todayRisk = riskAssessmentData[riskAssessmentData.length - 1];
  const todayInfo = getLevelInfo(todayRisk.level);

  return (
    <Pressable onPress={() => router.push('/risk-assessment')}>
      <Card className={cn('p-4 h-[240px]', isDark && 'bg-surface-secondary')}>
        <View className="flex-1 justify-between">
          {/* 헤더 */}
          <View className="flex-row items-center justify-between mb-3">
            <AppText className="text-sm font-semibold text-foreground">
              금일 위험성 평가
            </AppText>
            <MaterialCommunityIcons
              name="arrow-top-right"
              size={18}
              color={isDark ? '#a1a1aa' : '#71717a'}
            />
          </View>

          {/* 위험성 정보 */}
          <View className="mb-3">
            <View className="flex-row items-baseline gap-1.5">
              <AppText className="text-xs text-foreground">위험성:</AppText>
              <AppText className={cn('text-s font-bold', todayInfo.textColor)}>
                {todayInfo.text}
              </AppText>
            </View>
          </View>

          {/* 캘린더 영역 - 고정 높이 */}
          <View className="h-20 justify-center mb-3">
            <View className="flex-row justify-between items-center">
              {riskAssessmentData.map((item, index) => {
                const info = getLevelInfo(item.level);
                return (
                  <View key={index} className="items-center gap-1.5 flex-1">
                    {/* 날짜 */}
                    <AppText className="text-[10px] text-muted">{item.date}</AppText>
                    {/* 레벨 표시 셀 */}
                    <Surface
                      variant="secondary"
                      className={cn(
                        'w-8 h-8 rounded-md items-center justify-center',
                        info.color
                      )}
                    >
                      <AppText className="text-[10px] font-semibold text-white">
                        {info.text[0]}
                      </AppText>
                    </Surface>
                  </View>
                );
              })}
            </View>
          </View>

          {/* 범례 */}
          <View className="flex-row items-center justify-between">
            <AppText className="text-[10px] text-muted">Less</AppText>
            <View className="flex-row gap-1">
              <View className="w-2.5 h-2.5 rounded-sm bg-success" />
              <View className="w-2.5 h-2.5 rounded-sm bg-warning" />
              <View className="w-2.5 h-2.5 rounded-sm bg-danger" />
            </View>
            <AppText className="text-[10px] text-muted">High</AppText>
          </View>
        </View>
      </Card>
    </Pressable>
  );
};


export default function App() {
  const { isDark } = useAppTheme();

  return (
    <ScreenScrollView>
      <View className="items-center justify-center my-4">
        <AppText className="text-muted text-base">최근 발생한 사고 유형</AppText>
      </View>

      {/* Favorite Items Section */}
      <View className="mb-6">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 8 }}
        >
          {favorites.map((favorite) => (
            <FavoriteItem key={favorite.id} data={favorite} />
          ))}
        </ScrollView>
      </View>

      {/* 안전지수 & 위험성 평가 섹션 */}
      <View className="flex-row gap-3 mb-6 px-4">
        <View className="flex-1">
          <SafetyIndexCard />
        </View>
        <View className="flex-1">
          <RiskAssessmentCard />
        </View>
      </View>

      <View className="gap-6">
        {cards
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
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ScreenScrollView>
  );
}