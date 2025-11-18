import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import {
  Button,
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
import { useAppTheme } from '../../../../contexts/app-theme-context';
import { useRisk, TBM_LABELS } from '../../../../contexts/risk-context';
import type { Tbm, TbmKey } from '../../../../contexts/risk-context'; 

export default function TbmEdit() {
  const { tbm, setTbm} = useRisk();
  const { index } = useLocalSearchParams<{ index: TbmKey }>();  // ✅ index 파라미터
  const tbmIndex = index;
  const selectedTbm= tbm[tbmIndex].join('\n');
  const [tbmInput, setTbmInput] = useState(
    selectedTbm ?? ""
  );

  const router = useRouter();
  const { isDark } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const themeColorMuted = useThemeColor('muted');

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
          <View>
            <TextField className="flex-1">
              <TextField.Label className="text-[12px]">
                {TBM_LABELS[tbmIndex]}
              </TextField.Label>

              <TextField.Input
                multiline                 // ✅ textarea 모드
                numberOfLines={30}        // 대략 높이 기준 (필수는 아님)
                value={tbmInput}
                onChangeText={setTbmInput}
                autoCapitalize="none"
                scrollEnabled             // 내용 많아지면 스크롤

                classNames={{
                  // ✅ 바깥 테두리 박스(Animated.View)의 높이 지정
                  container: "h-[300px] items-start", 
                  // ✅ 안쪽 TextInput 스타일
                  input: "text-[14px] font-normal",
                }}
                style={{
                  color: themeColorMuted
                }}
              />
            </TextField>
          </View>
        </ScrollView>

        {/* ✅ 하단 고정 버튼 영역 */}
        <View className="border-t border-border bg-background px-4 py-3">
          <Button size="md"
            onPress={() => {
              const editedTbm: Partial<Tbm> = {};
              editedTbm[tbmIndex] = tbmInput.split('\n')
              const updatedTbm = {...tbm, ...editedTbm}
              setTbm(updatedTbm);                 
              router.back();
            }}>
              수정 완료
          </Button>
        </View>   
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </KeyboardAvoidingView>
  );
}