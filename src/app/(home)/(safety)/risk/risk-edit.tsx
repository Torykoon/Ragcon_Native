import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Select,
  TextField,
  useThemeColor
} from 'heroui-native';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native';
import { AppText } from '../../../../components/app-text';
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { SelectOption, RISK_VALUES, useRisk } from '../../../../contexts/risk-context';

export default function RiskEdit() {
  const { hazard, setHazard} = useRisk();
  const { index } = useLocalSearchParams<{ index?: string }>();  // ✅ index 파라미터
  const hazardIndex = index ? Number(index) : 0;
  const selectedHazard = hazard[hazardIndex];                     // ✅ 선택된 hazard
  const [hazardInput, setHazardInput] = useState(
    selectedHazard?.hazard_detail ?? ""
  );
  const [safetyMeasuresInput, setSafetyMeasuresInput] = useState<string>(
    (selectedHazard?.safety_measures ?? []).join('\n')
  );
  const [currentSafetyMeasuresInput, setCurrentSafetyMeasuresInput] = useState(
    selectedHazard?.current_safety_measures ?? ''
  );
  // ✅ 현재 위험성: Select의 value로 쓸 "문자열" (예: '3', '2', '1', '-')
  const [currentRiskValueInput, setCurrentRiskValueInput] = useState<string>(
    selectedHazard?.current_risk_value ?? '-'  // 없으면 '미정'
  );

  // ✅ 안전보건조치 후 위험성도 동일하게 문자열로
  const [residualRiskValueInput, setResidualRiskValueInput] = useState<string>(
    selectedHazard?.residual_risk_value ?? '-'
  );
  const router = useRouter();
  const { isDark } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const themeColorMuted = useThemeColor('muted');
  
  // onValueChange 공통 처리 함수 (string 또는 {value,label} 둘 다 대응)
  const handleSelectChange = (value: any, setter: (v: string) => void) => {
    const v =
      typeof value === 'string'
        ? value
        : value && typeof value.value === 'string'
        ? value.value
        : '-';
    setter(v);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      className="flex-1 bg-background"
    >
      {/* ✅ ScrollView + 버튼을 한 번 더 감싸서 레이아웃 안정화 */}
      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 90,
            // ✅ 버튼 높이 + 여유만큼 paddingBottom 늘리기
            paddingBottom: 160,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={true}
        >
          <View className="flex flex-col gap-[10px]">
            <TextField isRequired>
              <TextField.Label className="text-[12px]">유해위험요인</TextField.Label>
              <TextField.Input
                className="text-[12px] font-normal"
                style={{ color: themeColorMuted}}
                autoCapitalize="none"
                value={hazardInput}                 // ✅ defaultValue → value
                onChangeText={setHazardInput}       // ✅ 입력 시 로컬 상태 갱신
              />
            </TextField>
            <TextField>
              <TextField.Label className="text-[12px]">현재 조치상황</TextField.Label>
              <TextField.Input
                className="text-[12px] font-normal"
                style={{ color: themeColorMuted}}
                autoCapitalize="none"
                multiline
                numberOfLines={3}
                value={currentSafetyMeasuresInput}
                onChangeText={setCurrentSafetyMeasuresInput} 
              />
            </TextField>
            <TextField>
              <TextField.Label className="text-[12px]">현재 위험성</TextField.Label>

              {/** 선택된 value에 해당하는 SelectOption 객체 찾기 */}
              {(() => {
                const selectedOption: SelectOption | undefined =
                  RISK_VALUES.find((r) => r.value === currentRiskValueInput);

                return (
                  <Select
                    value={currentRiskValueInput}           // ✅ string
                    onValueChange={(value) => handleSelectChange(value, setCurrentRiskValueInput)}
                  >
                    <Select.Trigger asChild>
                      <Button variant="secondary" className="min-w-28">
                        {selectedOption ? (
                          <View className="flex-row items-center gap-2">
                            <AppText className="text-sm text-accent font-medium">
                              {selectedOption.label}
                            </AppText>
                          </View>
                        ) : (
                          <AppText className="text-accent">-</AppText>
                        )}
                      </Button>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Overlay />
                      <Select.Content
                        width={200}
                        className="aspect-[1.2]"
                        presentation="popover"
                        placement="top"
                        align="start"
                        alignOffset={-20}
                      >
                        <ScrollView>
                          {RISK_VALUES.map((riskvalue) => (
                            <Select.Item
                              key={riskvalue.value}
                              value={riskvalue.value}       // ✅ string
                              label={riskvalue.label}
                            >
                              <View className="flex-row items-center gap-3">
                                <AppText className="text-sm text-muted w-10">
                                  {riskvalue.code}
                                </AppText>
                                <AppText className="text-base text-foreground flex-1">
                                  {riskvalue.label}
                                </AppText>
                              </View>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </ScrollView>
                      </Select.Content>
                    </Select.Portal>
                  </Select>
                );
              })()}
            </TextField>
            <TextField isRequired>
              <TextField.Label className="text-[12px]">안전보건조치</TextField.Label>
              <TextField.Input
                className="text-[12px] font-normal"
                multiline
                numberOfLines={3}
                style={{ color: themeColorMuted}}
                autoCapitalize="none"
                value={safetyMeasuresInput}
                onChangeText={setSafetyMeasuresInput}
              />
            </TextField>
            <TextField>
              <TextField.Label className="text-[12px]">안전보건조치 후 위험성</TextField.Label>

              {(() => {
                const selectedOption =
                  RISK_VALUES.find((r) => r.value === residualRiskValueInput) ?? null;

                return (
                  <Select
                    value={residualRiskValueInput}
                    onValueChange={(value) => handleSelectChange(value, setResidualRiskValueInput)}
                  >
                    <Select.Trigger asChild>
                      <Button variant="secondary" className="min-w-28">
                        {selectedOption ? (
                          <View className="flex-row items-center gap-2">
                            <AppText className="text-sm text-accent font-medium">
                              {selectedOption.label}
                            </AppText>
                          </View>
                        ) : (
                          <AppText className="text-accent">-</AppText>
                        )}
                      </Button>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Overlay />
                      <Select.Content
                        width={200}
                        className="aspect-[1.2]"
                        presentation="popover"
                        placement="top"
                        align="start"
                        alignOffset={-20}
                      >
                        <ScrollView>
                          {RISK_VALUES.map((riskvalue) => (
                            <Select.Item
                              key={riskvalue.value}
                              value={riskvalue.value}
                              label={riskvalue.label}
                            >
                              <View className="flex-row items-center gap-3">
                                <AppText className="text-sm text-muted w-10">
                                  {riskvalue.code}
                                </AppText>
                                <AppText className="text-base text-foreground flex-1">
                                  {riskvalue.label}
                                </AppText>
                              </View>
                              <Select.ItemIndicator />
                            </Select.Item>
                          ))}
                        </ScrollView>
                      </Select.Content>
                    </Select.Portal>
                  </Select>
                );
              })()}
            </TextField>
          </View>
        </ScrollView>

        {/* ✅ 하단 고정 버튼 영역 */}
        <View className="border-t border-border bg-background px-4 py-3">
          <Button size="md"
            onPress={() => {
              const updatedHazards = hazard.map((h, i) =>
                i === hazardIndex
                  ? {
                    hazard_category: h['hazard_category'],
                    hazard_cause: h['hazard_cause'],
                    hazard_detail: hazardInput,
                    legal_reference: h['legal_reference'],
                    safety_measures: safetyMeasuresInput.split('\n').map((s) => s.trim()).filter((s) => s.length > 0),
                    risk_likelihood: h['risk_likelihood'],
                    risk_severity: h['risk_severity'],
                    risk_level: h['risk_level'],
                    mitigation: h['mitigation'],
                    current_safety_measures: currentSafetyMeasuresInput || null,
                    current_risk_value: currentRiskValueInput || null,
                    residual_risk_value: residualRiskValueInput || null,
                  }  // ✅ 여기서 필드만 변경
                  : h
              );

              setHazard(updatedHazards);                  // ✅ 전체 배열 저장
              router.push("/(home)/(safety)/risk/risk");
            }}>
              수정 완료
          </Button>
        </View>   
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </KeyboardAvoidingView>
  );
}