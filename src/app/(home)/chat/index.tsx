import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import {
  Card,
  cn,
  Spinner,
  useThemeColor
} from 'heroui-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, {
  FadeIn,
  FadeInDown,
  LinearTransition,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';
import { AppText } from '../../../components/app-text';
import { ModelSelect } from '../../../components/showcases/raycast/model-select';
import type { ModelOption } from '../../../components/showcases/raycast/model-select/types';
import { useAppTheme } from '../../../contexts/app-theme-context';



const StyledFeather = withUniwind(Feather);
const StyledFontAwesome6 = withUniwind(FontAwesome6);
const StyledIonicons = withUniwind(Ionicons);
const AnimatedView = Animated.createAnimatedComponent(View);

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type ApiResponse = {
  answer: string;
  state: {
    answer_text: string;
  };
};

const API_URL = 'http://43.200.214.138:8080/ragcon';

const MODELS: ModelOption[] = [
  { value: 'chatgpt', label: 'ChatGPT'},
  { value: 'claude', label: 'Claude'},
  { value: 'gemini', label: 'Gemini'},
  { value: 'perplexity', label: 'Perplexity'},
  { value: 'deepseek', label: 'DeepSeek'},
  { value: 'llama', label: 'Llama'},
  { value: 'grok', label: 'Grok'},
  { value: 'mistral', label: 'Mistral' },
  { value: 'moonshot', label: 'Moonshot AI'},
  { value: 'qwen', label: 'Qwen'},
];

const simulatePress = () => {
  Alert.alert('Coming soon!');
};

export default function Chat() {
  const { isDark } = useAppTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState<ModelOption>(MODELS[0]!);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const themeColorForeground = useThemeColor('foreground');
  const themeColorMuted = useThemeColor('muted');
  const themeColorBackground = useThemeColor('background');
  const themeColorSurface = useThemeColor('surface');
  const themeColorAccent = useThemeColor('accent');
  const themeColorBorder = useThemeColor('border');

  // 키보드 이벤트 리스너 추가
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardWillShow.remove();
    };
  }, []);

  const markdownStyles = {
    body: {
      color: themeColorForeground,
      fontSize: 15,
      lineHeight: 22,
    },
    heading1: {
      color: themeColorForeground,
      fontSize: 24,
      fontWeight: '700' as const,
      marginTop: 20,
      marginBottom: 10,
    },
    heading2: {
      color: themeColorForeground,
      fontSize: 20,
      fontWeight: '600' as const,
      marginTop: 16,
      marginBottom: 8,
    },
    heading3: {
      color: themeColorForeground,
      fontSize: 18,
      fontWeight: '600' as const,
      marginTop: 12,
      marginBottom: 6,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 10,
      color: themeColorForeground,
      lineHeight: 22,
    },
    listItemBullet: {
      color: themeColorAccent,
      fontSize: 16,
      lineHeight: 22,
    },
    listItemNumber: {
      color: themeColorAccent,
      fontWeight: '600' as const,
    },
    listItem: {
      marginBottom: 8,
    },
    bullet_list: {
      marginBottom: 12,
    },
    ordered_list: {
      marginBottom: 12,
    },
    code_inline: {
      backgroundColor: themeColorSurface,
      color: themeColorAccent,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
      }),
      fontSize: 14,
    },
    code_block: {
      backgroundColor: themeColorSurface,
      color: themeColorForeground,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
      }),
      fontSize: 14,
    },
    fence: {
      backgroundColor: themeColorSurface,
      color: themeColorForeground,
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      fontFamily: Platform.select({
        ios: 'Menlo',
        android: 'monospace',
      }),
      fontSize: 14,
    },
    link: {
      color: themeColorAccent,
      textDecorationLine: 'underline'as const,
    },
    blockquote: {
      backgroundColor: themeColorSurface,
      borderLeftColor: themeColorAccent,
      borderLeftWidth: 4,
      paddingLeft: 12,
      paddingRight: 12,
      paddingVertical: 8,
      marginVertical: 8,
    },
    hr: {
      backgroundColor: themeColorBorder,
      height: 1,
      marginVertical: 16,
    },
    strong: {
      fontWeight: '700' as const,
      color: themeColorForeground,
    },
    em: {
      fontStyle: 'italic',
      color: themeColorForeground,
    },
    table: {
      borderWidth: 1,
      borderColor: themeColorBorder,
      borderRadius: 8,
      marginVertical: 8,
    },
    th: {
      backgroundColor: themeColorSurface,
      padding: 8,
      fontWeight: '600' as const,
    },
    td: {
      padding: 8,
      borderTopWidth: 1,
      borderTopColor: themeColorBorder,
    },
  };

  // TextInput 포커스 핸들러
  const handleInputFocus = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 300);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom after adding user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage.content,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Scroll to bottom after adding assistant message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        '오류',
        '메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isLoading]);

  const renderMessage = useCallback(
    (message: Message, index: number) => {
      const isUser = message.role === 'user';

      return (
        <AnimatedView
          key={message.id}
          entering={FadeInDown.delay(index * 50)}
          layout={LinearTransition}
          className={`mb-4 ${isUser ? 'items-end' : 'items-start'}`}
        >
          <View className={`${isUser ? 'max-w-[85%] items-end' : 'w-full items-start'}`}>
            {isUser ? (
              <View className="bg-accent rounded-2xl px-4 py-3">
                <AppText className="text-accent-foreground text-base">
                  {message.content}
                </AppText>
              </View>
            ) : (
              <Card variant="secondary" className="p-4 w-full">
                <ScrollView 
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  nestedScrollEnabled={true}
                >
                  <Markdown style={markdownStyles}>
                    {message.content}
                  </Markdown>
                </ScrollView>
              </Card>
            )}
            <AppText className="text-muted text-xs mt-1 px-2">
              {message.timestamp.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </AppText>
          </View>
        </AnimatedView>
      );
    },
    [markdownStyles]
  );

  const renderTypingIndicator = useCallback(() => {
    if (!isLoading) return null;

    return (
      <AnimatedView entering={FadeIn} className="mb-4 items-start">
        <Card variant="secondary" className="px-4 py-3 flex-row items-center gap-2">
          <ActivityIndicator size="small" color={themeColorAccent} />
          <AppText className="text-muted text-sm">답변 생성 중...</AppText>
        </Card>
      </AnimatedView>
    );
  }, [isLoading, themeColorAccent]);

  const renderEmptyState = useCallback(() => {
    if (messages.length > 0) return null;

    return (
      <View className="flex-1 items-center justify-center px-6">
        <AnimatedView
          entering={FadeIn.delay(200)}
          className="items-center gap-4"
        >
          <View className="size-16 rounded-full bg-accent/10 items-center justify-center">
            <StyledFeather
              name="message-circle"
              size={32}
              className="text-accent"
            />
          </View>
          <View className="items-center gap-2">
            <AppText className="text-foreground text-xl font-semibold">
              AI 챗봇에게 물어보세요
            </AppText>
            <AppText className="text-muted text-center text-sm">
              건설 안전 관련 질문을 입력하시면{'\n'}상세한 답변을 제공해드립니다
            </AppText>
          </View>
        </AnimatedView>
      </View>
    );
  }, [messages.length]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
      className="flex-1 bg-background"
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={true}
      >
        {renderEmptyState()}
        {messages.map((message, index) => renderMessage(message, index))}
        {renderTypingIndicator()}
      </ScrollView>

      <View className="bg-background px-4 py-3 pb-safe">
        <View
          className={cn(
            'p-2 bg-surface-quaternary/70 rounded-3xl border border-neutral-400/10 gap-7',
            isDark && 'border-neutral-600/10'
          )}
          style={styles.borderCurve}
        >
          <View className="flex-row items-center justify-between pr-1">
            <ModelSelect data={MODELS} model={model} setModel={setModel} />
            <Pressable
              className="flex-row items-center gap-1.5"
              onPress={simulatePress}
            >
              <AppText
                className={cn(
                  'text-lg text-neutral-800',
                  isDark && 'text-neutral-300'
                )}
              >
                Auto
              </AppText>
              <StyledIonicons
                name="chevron-expand"
                size={16}
                className="text-muted"
              />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-3">
            <Pressable className="p-2 opacity-80" onPress={simulatePress}>
              <StyledFontAwesome6
                name="paperclip"
                size={20}
                className="text-foreground"
              />
            </Pressable>
            <View className="flex-1">
              <TextInput
                ref={inputRef}
                placeholder={`Ask ${model.label}...`}
                placeholderTextColor={themeColorMuted}
                value={inputText}
                onChangeText={setInputText}
                onFocus={handleInputFocus}
                editable={!isLoading}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
                blurOnSubmit={false}
                multiline
                maxLength={500}
                style={{
                  fontSize: 18,
                  color: themeColorForeground,
                  maxHeight: 100,
                  minHeight: 40,
                }}
              />
            </View>
            <Pressable
              className={cn(
                'flex-row items-center justify-center gap-1 px-7 py-4 rounded-[16px] bg-neutral-300/50 border border-neutral-400/30',
                isDark && 'bg-neutral-700/50 border-neutral-600/30',
                (!inputText.trim() || isLoading) && 'opacity-50'
              )}
              style={styles.borderCurve}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <Spinner size="sm" />
              ) : (
                <StyledFeather
                  name="send"
                  size={20}
                  className="text-foreground"
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>

      <StatusBar style={isDark ? 'light' : 'dark'} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  borderCurve: {
    borderCurve: 'continuous',
  },
});