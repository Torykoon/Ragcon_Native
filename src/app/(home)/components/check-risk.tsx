import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import {
  Button,
  Card,
} from 'heroui-native';
import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { useRisk } from '../../../contexts/risk-context';



export default function CheckRisk() {
  const { hazard } = useRisk();
  const router = useRouter();
  const { isDark } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      className="flex-1 bg-background"
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 90,
          paddingBottom: 16,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={true}
      >
        <View className="flex flex-col gap-[10px]">
          {hazard.map((item, index) => {
                return (
                  <Card key={index} className="pr-2">
                    <View className="flex flex-row">
                      <Card.Body className="flex-1 gap-2">
                        <View className="flex flex-row gap-1">
                          <Card.Title className="text-[12px]"
                            style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                          >유해위험요인</Card.Title>
                          <Card.Description className="text-[12px]"
                            style={{ flexShrink: 1, flexWrap: 'wrap' }}
                          >{item.hazard_detail}
                          </Card.Description>
                        </View>
                        <View className="flex flex-row gap-1">
                          <Card.Title className="text-[12px]"
                            style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                          >현재 조치상황</Card.Title>
                          <Card.Description className="text-[12px]"
                            style={{ flexShrink: 1, flexWrap: 'wrap' }}
                          >{item.current_safety_measures ?? '-'}
                          </Card.Description>
                        </View>
                        <View className="flex flex-row gap-1">
                          <Card.Title className="text-[12px]"
                            style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                          >현재 위험성</Card.Title>
                          <Card.Description className="text-[12px]"
                            style={{ flexShrink: 1, flexWrap: 'wrap' }}
                          >{item.current_risk_value ?? '-'}
                          </Card.Description>
                        </View>
                        <View className="flex flex-row gap-1">
                          <Card.Title className="text-[12px]"
                            style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                          >안전보건조치</Card.Title>
                          <Card.Description className="text-[12px]"
                            style={{ flexShrink: 1, flexWrap: 'wrap' }}
                          >{(item.safety_measures).join('\n')}
                          </Card.Description>
                        </View>
                        <View className="flex flex-row gap-1">
                          <Card.Title className="text-[12px]"
                            style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                          >안전보건조치 후{'\n'}위험성</Card.Title>
                          <Card.Description className="text-[12px]"
                            style={{ flexShrink: 1, flexWrap: 'wrap' }}
                          >{item.residual_risk_value ?? '-'}
                          </Card.Description>
                        </View>
                      </Card.Body>
                    </View>
                  </Card>
                );
              }
            )
          }
        </View>
      </ScrollView>

      <View className="border-t border-border bg-background px-4 pt-3 pb-12">
        <Button size="md"
          onPress={() => router.back()}
        >
          내용 확인 완료</Button>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </KeyboardAvoidingView>
  );
}