import { Card, Surface } from 'heroui-native';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../../../components/app-text';
import { ScreenScrollView } from '../../../../components/screen-scroll-view';
import { useWork } from '../../../../contexts/work-context';

export default function AssessmentScreen() {
  // work-context에서 저장된 데이터 가져오기
  const { selectedWork, selectedEquipment } = useWork();

  return (
    <ScreenScrollView>
      <View className="flex-1 px-4">
        {/* 페이지 제목 */}
        <View className="items-center justify-center my-4">
          <AppText className="text-2xl font-semibold text-foreground">
            위험성 평가 작성
          </AppText>
          <AppText className="text-lg text-muted mt-2">
            AI를 활용한 위험성 평가 작성 페이지입니다.
          </AppText>
        </View>

        {/* 선택된 정보 표시 카드 */}
        <Card className="p-4 mb-6">
          <AppText className="text-base font-semibold text-foreground mb-3">
            선택된 작업 정보
          </AppText>

          {/* 작업 정보 */}
          <Surface variant="secondary" className="p-3 rounded-lg mb-2">
            <View className="flex-row items-center justify-between">
              <AppText className="text-sm text-muted">작업</AppText>
              <AppText className="text-sm font-medium text-foreground">
                {selectedWork ? selectedWork.label : '미선택'}
              </AppText>
            </View>
          </Surface>

          {/* 사용 장비 */}
          <Surface variant="secondary" className="p-3 rounded-lg">
            <View className="flex-row items-center justify-between">
              <AppText className="text-sm text-muted">사용 장비</AppText>
              <AppText className="text-sm font-medium text-foreground">
                {selectedEquipment ? selectedEquipment.label : '미선택'}
              </AppText>
            </View>
          </Surface>
        </Card>

        {/* 선택되지 않았을 때 안내 메시지 */}
        {(!selectedWork || !selectedEquipment) && (
          <Card className="p-4 bg-warning/10 border border-warning/20">
            <AppText className="text-sm text-warning text-center">
              ⚠️ 작업 정보를 먼저 선택해주세요
            </AppText>
            <AppText className="text-xs text-muted text-center mt-1">
              이전 화면에서 작업과 장비를 선택하세요
            </AppText>
          </Card>
        )}

        {/* 선택이 완료되었을 때 추가 컨텐츠 */}
        {selectedWork && selectedEquipment && (
          <Card className="p-4 bg-success/10 border border-success/20">
            <AppText className="text-sm text-success text-center">
              ✓ 모든 정보가 선택되었습니다
            </AppText>
            <AppText className="text-xs text-muted text-center mt-1">
              이제 위험성 평가를 작성할 수 있습니다
            </AppText>
          </Card>
        )}
      </View>
    </ScreenScrollView>
  );
}