import React, { useEffect, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';

export type DiaryEmotion = '매우 좋음' | '좋음' | '보통' | '나쁨' | '매우 나쁨';

export type DiaryFormValues = {
  diaryDate: Date;
  emotion: string;
  sleepStartTime: Date;
  sleepEndTime: Date;
  // sleepHours: string;
  medicationTaken: boolean;
  medicationReaction: string;
  content: string;
  externalStress: boolean;
};

type FormErrors = {
  emotion?: string;
  medicationTaken?: string;
  medicationReaction?: string;
  content?: string;
  externalStress?: string;
};

type DiaryFormProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<DiaryFormValues>;
  submitButtonText?: string;
  onSubmit: (values: {
    diaryDate: string;
    emotion: string;
    sleepStartTime: string;
    sleepEndTime: string;
    // sleepHours: string;
    medicationTaken: boolean;
    medicationReaction: string;
    content: string;
    externalStress: boolean;
  }) => void;
};

const emotions: DiaryEmotion[] = [
  '매우 좋음',
  '좋음',
  '보통',
  '나쁨',
  '매우 나쁨',
];

const emotionsConvertMap = {
  '매우 좋음': 'GREAT',
  좋음: 'GOOD',
  보통: 'NORMAL',
  나쁨: 'BAD',
  '매우 나쁨': 'VERY_BAD',
};

const defaultSleepStart = dayjs()
  .hour(23)
  .minute(0)
  .second(0)
  .millisecond(0)
  .toDate();
const defaultSleepEnd = dayjs()
  .hour(7)
  .minute(0)
  .second(0)
  .millisecond(0)
  .toDate();

const DiaryForm: React.FC<DiaryFormProps> = ({
  mode,
  initialValues,
  submitButtonText,
  onSubmit,
}) => {
  const [date, setDate] = useState<Date>(
    initialValues?.diaryDate ?? new Date(),
  );
  const [selectedEmotion, setSelectedEmotion] = useState<string>(
    initialValues?.emotion ?? '',
  );
  const [sleepStart, setSleepStart] = useState<Date>(
    initialValues?.sleepStartTime ?? defaultSleepStart,
  );
  const [sleepEnd, setSleepEnd] = useState<Date>(
    initialValues?.sleepEndTime ?? defaultSleepEnd,
  );
  const [medicationTaken, setMedicationTaken] = useState<boolean | null>(
    initialValues?.medicationTaken ?? null,
  );
  const [medicationReaction, setMedicationReaction] = useState<string>(
    initialValues?.medicationReaction ?? '',
  );
  const [content, setContent] = useState<string>(initialValues?.content ?? '');
  const [externalStress, setExternalStress] = useState<boolean | null>(
    initialValues?.externalStress ?? null,
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showSleepStartPicker, setShowSleepStartPicker] =
    useState<boolean>(false);
  const [showSleepEndPicker, setShowSleepEndPicker] = useState<boolean>(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const formatDate = (value: Date): string => dayjs(value).format('YYYY-MM-DD');
  const formatTime = (value: Date): string => dayjs(value).format('HH:mm');

  const calculatedSleepHours = useMemo((): string => {
    let start = dayjs(sleepStart);
    let end = dayjs(sleepEnd);

    if (end.isBefore(start)) {
      end = end.add(1, 'day');
    }

    const diffMinutes = end.diff(start, 'minute');
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}시간 ${minutes}분`;
  }, [sleepStart, sleepEnd]);

  useEffect(() => {
    if (medicationTaken === false) {
      setMedicationReaction('');
    }
  }, [medicationTaken]);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!selectedEmotion) {
      nextErrors.emotion = '오늘의 감정을 선택해주세요.';
    }

    if (externalStress === null) {
      nextErrors.externalStress = '외부 스트레스 요인을 선택해주세요.';
    }

    if (medicationTaken === null) {
      nextErrors.medicationTaken = '복약 여부를 선택해주세요.';
    }

    if (medicationTaken === true && !medicationReaction.trim()) {
      nextErrors.medicationReaction = '복약 후 반응을 입력해주세요.';
    }

    if (!content.trim()) {
      nextErrors.content = '오늘의 일기를 입력해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = useMemo((): boolean => {
    if (!selectedEmotion) return false;
    if (externalStress === null) return false;
    if (medicationTaken === null) return false;
    if (medicationTaken === true && !medicationReaction.trim()) return false;
    if (!content.trim()) return false;
    return true;
  }, [
    selectedEmotion,
    externalStress,
    medicationTaken,
    medicationReaction,
    content,
  ]);

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ): void => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'dismissed') return;
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeSleepStart = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ): void => {
    if (Platform.OS === 'android') {
      setShowSleepStartPicker(false);
    }

    if (event.type === 'dismissed') return;
    if (selectedDate) setSleepStart(selectedDate);
  };

  const onChangeSleepEnd = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ): void => {
    if (Platform.OS === 'android') {
      setShowSleepEndPicker(false);
    }

    if (event.type === 'dismissed') return;
    if (selectedDate) setSleepEnd(selectedDate);
  };

  const handleSubmit = (): void => {
    setSubmitted(true);

    const isValid = validateForm();
    if (!isValid) return;

    onSubmit({
      diaryDate: formatDate(date),
      emotion:
        emotionsConvertMap[selectedEmotion as keyof typeof emotionsConvertMap],
      // sleepStartTime: formatTime(sleepStart),
      // sleepEndTime: formatTime(sleepEnd),
      // sleepHours: calculatedSleepHours,
      sleepStartTime: dayjs(sleepStart).format('YYYY-MM-DDTHH:mm'),
      sleepEndTime: dayjs(sleepEnd).format('YYYY-MM-DDTHH:mm'),
      medicationTaken: medicationTaken as boolean,
      medicationReaction: medicationTaken ? medicationReaction : '',
      content: content.trim(),
      externalStress: externalStress as boolean,
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {mode === 'create' ? '오늘 기록하기' : '일기 수정하기'}
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>날짜</Text>
          <Pressable
            style={({ pressed }) => [
              styles.pickerButton,
              pressed && styles.pressed,
            ]}
            onPress={() => {
              setShowDatePicker(prev => !prev);
              setShowSleepStartPicker(false);
              setShowSleepEndPicker(false);
            }}
          >
            <Text style={styles.pickerButtonText}>{formatDate(date)}</Text>
          </Pressable>

          {showDatePicker && (
            <View style={styles.iosPickerWrapper}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={onChangeDate}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>오늘의 감정</Text>
          <View
            style={[
              styles.pickerWrapper,
              submitted && errors.emotion && styles.inputErrorBorder,
            ]}
          >
            <Picker
              selectedValue={selectedEmotion}
              onValueChange={(itemValue: string) => {
                setSelectedEmotion(itemValue);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    emotion: itemValue ? '' : '오늘의 감정을 선택해주세요.',
                  }));
                }
              }}
            >
              <Picker.Item label="감정을 선택하세요" value="" />
              {emotions.map(emotion => (
                <Picker.Item key={emotion} label={emotion} value={emotion} />
              ))}
            </Picker>
          </View>
          {submitted && errors.emotion ? (
            <Text style={styles.errorText}>{errors.emotion}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>수면 시간</Text>

          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <Text style={styles.subLabel}>수면 시작 시간</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.pickerButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  setShowSleepStartPicker(prev => !prev);
                  setShowSleepEndPicker(false);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.pickerButtonText}>
                  {formatTime(sleepStart)}
                </Text>
              </Pressable>
            </View>

            <View style={styles.halfWidth}>
              <Text style={styles.subLabel}>수면 종료 시간</Text>
              <Pressable
                style={({ pressed }) => [
                  styles.pickerButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  setShowSleepEndPicker(prev => !prev);
                  setShowSleepStartPicker(false);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.pickerButtonText}>
                  {formatTime(sleepEnd)}
                </Text>
              </Pressable>
            </View>
          </View>

          {Platform.OS === 'ios' && showSleepStartPicker && (
            <View style={styles.fullWidthPickerWrapper}>
              <DateTimePicker
                value={sleepStart}
                mode="time"
                display="spinner"
                is24Hour={true}
                onChange={onChangeSleepStart}
              />
            </View>
          )}

          {Platform.OS === 'ios' && showSleepEndPicker && (
            <View style={styles.fullWidthPickerWrapper}>
              <DateTimePicker
                value={sleepEnd}
                mode="time"
                display="spinner"
                is24Hour={true}
                onChange={onChangeSleepEnd}
              />
            </View>
          )}

          {Platform.OS === 'android' && showSleepStartPicker && (
            <DateTimePicker
              value={sleepStart}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={onChangeSleepStart}
            />
          )}

          {Platform.OS === 'android' && showSleepEndPicker && (
            <DateTimePicker
              value={sleepEnd}
              mode="time"
              display="default"
              is24Hour={true}
              onChange={onChangeSleepEnd}
            />
          )}

          <View style={styles.sleepSummaryBox}>
            <Text style={styles.sleepSummaryLabel}>총 수면시간</Text>
            <Text style={styles.sleepSummaryValue}>{calculatedSleepHours}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>외부 스트레스 요인</Text>
          <View style={styles.toggleContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                externalStress === true && styles.toggleButtonSelected,
                submitted && errors.externalStress && styles.inputErrorBorder,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setExternalStress(true);
                if (submitted) {
                  setErrors(prev => ({ ...prev, externalStress: '' }));
                }
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  externalStress === true && styles.toggleTextSelected,
                ]}
              >
                있음
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                externalStress === false && styles.toggleButtonSelected,
                submitted && errors.externalStress && styles.inputErrorBorder,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setExternalStress(false);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    externalStress: '',
                  }));
                }
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  externalStress === false && styles.toggleTextSelected,
                ]}
              >
                없음
              </Text>
            </Pressable>
          </View>
          {submitted && errors.medicationTaken ? (
            <Text style={styles.errorText}>{errors.medicationTaken}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>복약 여부</Text>
          <View style={styles.toggleContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                medicationTaken === true && styles.toggleButtonSelected,
                submitted && errors.medicationTaken && styles.inputErrorBorder,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setMedicationTaken(true);
                if (submitted) {
                  setErrors(prev => ({ ...prev, medicationTaken: '' }));
                }
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  medicationTaken === true && styles.toggleTextSelected,
                ]}
              >
                복용함
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                medicationTaken === false && styles.toggleButtonSelected,
                submitted && errors.medicationTaken && styles.inputErrorBorder,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setMedicationTaken(false);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    medicationTaken: '',
                    medicationReaction: '',
                  }));
                }
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  medicationTaken === false && styles.toggleTextSelected,
                ]}
              >
                복용 안 함
              </Text>
            </Pressable>
          </View>
          {submitted && errors.medicationTaken ? (
            <Text style={styles.errorText}>{errors.medicationTaken}</Text>
          ) : null}
        </View>

        {medicationTaken === true && (
          <View style={styles.section}>
            <Text style={styles.label}>복약 후 반응</Text>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                submitted &&
                  errors.medicationReaction &&
                  styles.inputErrorBorder,
              ]}
              placeholder="예: 졸림, 속이 메스꺼움, 별다른 변화 없음"
              value={medicationReaction}
              onChangeText={(text: string) => {
                setMedicationReaction(text);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    medicationReaction: text.trim()
                      ? ''
                      : '복약 후 반응을 입력해주세요.',
                  }));
                }
              }}
              multiline
              textAlignVertical="top"
            />
            {submitted && errors.medicationReaction ? (
              <Text style={styles.errorText}>{errors.medicationReaction}</Text>
            ) : null}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>오늘의 일기</Text>
          <TextInput
            style={[
              styles.input,
              styles.diaryInput,
              submitted && errors.content && styles.inputErrorBorder,
            ]}
            placeholder="오늘 있었던 일과 느낀 점을 적어보세요."
            value={content}
            onChangeText={(text: string) => {
              setContent(text);
              if (submitted) {
                setErrors(prev => ({
                  ...prev,
                  content: text.trim() ? '' : '오늘의 일기를 입력해주세요.',
                }));
              }
            }}
            multiline
            textAlignVertical="top"
          />
          {submitted && errors.content ? (
            <Text style={styles.errorText}>{errors.content}</Text>
          ) : null}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled,
            pressed && isFormValid && styles.pressed,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>
            {submitButtonText ?? (mode === 'create' ? '저장하기' : '수정하기')}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default DiaryForm;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  section: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 90,
  },
  diaryInput: {
    minHeight: 160,
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 15,
    color: '#111827',
  },
  iosPickerWrapper: {
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  fullWidthPickerWrapper: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  sleepSummaryBox: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  sleepSummaryLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  sleepSummaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleButtonSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  toggleTextSelected: {
    color: '#FFFFFF',
  },
  inputErrorBorder: {
    borderColor: '#EF4444',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: '#EF4444',
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.7,
  },
});
