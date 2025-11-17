import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import {
  Checkbox,
  Button,
  Card,
  Surface,
  useThemeColor,
  Divider,
  FormField,
} from 'heroui-native';
import React from 'react';
import { useRef } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
  Text
} from 'react-native';
import { useAppTheme } from '../../../contexts/app-theme-context';
import { useRisk, TBM_LABELS  } from '../../../contexts/risk-context';
import type { TbmKey, AppRoute } from '../../../contexts/risk-context'; 



export default function Tbm() {
  const { process, tbm } = useRisk();
  const router = useRouter();
  const { isDark } = useAppTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [fields, setFields] = React.useState({
      risks: false,
      accidents: false
    });
    
  const fieldConfigs: Record<
    keyof typeof fields,
    { title: string; url: AppRoute; }
  > = {
    risks: {
      title: '위험성평가 내용 확인',
      url: '/components/check-risk',
    },
    accidents: {
      title: '사고사례 내용 확인',
      url: '/components/check-accident',
    },
  };

  interface CheckboxFieldProps {
    isSelected: boolean;
    onSelectedChange: (value: boolean) => void;
    title: string;
  }

  const CheckboxField: React.FC<CheckboxFieldProps> = ({
    isSelected,
    onSelectedChange,
    title
  }) => {
    const themeColorSurfaceTertiary = useThemeColor('surface-tertiary');

    return (
      <FormField
        isSelected={isSelected}
        onSelectedChange={onSelectedChange}
        alignIndicator="start"
        className="items-start"
      >
        <FormField.Indicator>
          <Checkbox
            className="mt-0.5"
            animatedColors={{
              backgroundColor: { default: themeColorSurfaceTertiary },
            }}
          />
        </FormField.Indicator>
        <FormField.Content>
          <FormField.Title className="text-md">{title}</FormField.Title>
        </FormField.Content>
      </FormField>
    );
  };
  
  const handleFieldChange = (key: keyof typeof fields, url: AppRoute) => (value: boolean) => {
    if (!fields[key]) {
      setFields((prev) => ({ ...prev, [key]: value }));
      router.push(url);
    }
    setFields((prev) => ({ ...prev, [key]: value }));
  };
  const themeColorSurfaceTertiary = useThemeColor('surface-tertiary');
  const fieldKeys = Object.keys(fields) as Array<keyof typeof fields>;

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
          <Card className="pr-2">
            <View className="flex flex-row">
              <Card.Body className="flex-1 gap-2">
                <View className="flex flex-row gap-1">
                  <Card.Title className="text-[12px]"
                    style={{ width: 80, flexShrink: 0}}   // 원하는 폭으로 조절
                  >작업내용</Card.Title>
                  <Card.Description className="text-[12px]"
                    style={{ flexShrink: 1, flexWrap: 'wrap' }}
                  >{process}
                  </Card.Description>
                </View>
              </Card.Body>
            </View>
          </Card>
          {(Object.keys(tbm) as TbmKey[]).map((key) => {
            const value = tbm[key]; // value: string[]

            return (
              <Card key={key} className="pr-2">
                <View className="flex flex-row">
                  <Card.Body className="flex-1 gap-2">
                    <View className="flex flex-row gap-1">
                      <Card.Title
                        className="text-[12px]"
                        style={{ width: 80, flexShrink: 0 }}
                      >
                        {TBM_LABELS[key]}
                      </Card.Title>
                      <Card.Description
                        className="text-[12px]"
                        style={{ flexShrink: 1, flexWrap: 'wrap' }}
                      >
                        {value.join('\n')}
                      </Card.Description>
                    </View>
                  </Card.Body>
                <Pressable
                  onPress={() => router.push({
                    pathname: "/components/tbm-edit",
                    params: { index: String(key) },   // ✅ index 전달
                  })}
                  style={{
                    justifyContent: 'center', // 세로 중앙
                    alignItems: 'center',     // 가로 중앙
                  }}
                >
                  <View
                    style={{
                      paddingLeft: 8,
                    }}
                  >
                    <Image
                      source={require("../../../../assets/icons/arrow-right-icons.png")}
                      style={{ width: 12 }}
                      resizeMode="contain"
                    />
                  </View>
                </Pressable>
              </View>
            </Card>
          );
        })}
        </View>
        <View className="flex flex-col gap-[10px] pt-[10px]">
          <Surface className="py-5 w-full">
            {fieldKeys.map((key, index) => (
              <React.Fragment key={key}>
                {index > 0 && <Divider className="my-4" />}
                <CheckboxField
                  isSelected={fields[key]}
                  onSelectedChange={handleFieldChange(key, fieldConfigs[key].url)}
                  title={fieldConfigs[key].title}
                />
              </React.Fragment>
            ))}
          </Surface>
        </View>
      </ScrollView>

      <View className="border-t border-border bg-background px-4 pt-3 pb-12">
        <Button size="md"
          onPress={() => router.push("/")}
        >
          작성 완료</Button>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </KeyboardAvoidingView>
  );
}