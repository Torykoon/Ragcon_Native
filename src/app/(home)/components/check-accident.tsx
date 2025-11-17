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

export default function CheckAccident() {
  const { accidents } = useRisk();
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
          {accidents.map((item, index) => {
                return (
                  <Card key={index} className="pr-2">
                    <View className="flex flex-row">
                      <Card.Body className="flex-1 gap-2">
                        <View className="flex flex-row gap-1">
                          <Card.Title className="text-[12px]"
                            style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                          >사고번호</Card.Title>
                          <Card.Description className="text-[12px]"
                            style={{ flexShrink: 1, flexWrap: 'wrap' }}
                          >{item.metadata.case_no}
                          </Card.Description>
                        </View>
                        <View className="flex flex-row gap-1">
                          <Card.Title className="text-[12px]"
                            style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                          >사고내용</Card.Title>
                          <Card.Description className="text-[12px]"
                            style={{ flexShrink: 1, flexWrap: 'wrap' }}
                          >{item.chunk_content ?? '-'}
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