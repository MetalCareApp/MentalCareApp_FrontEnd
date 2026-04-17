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

export type DiaryEmotion = '좋음' | '보통' | '우울' | '불안' | '화남' | '지침';

export type DiaryFormValues = {
  date: Date;
  emotion: string;
  sleepStart: Date;
  sleepEnd: Date;
  tookMedicine: boolean | null;
  medicineReaction: string;
  diary: string;
};

type FormErrors = {
  emotion?: string;
  tookMedicine?: string;
  medicineReaction?: string;
  diary?: string;
};

type DiaryFormProps = {
  mode: 'create' | 'edit';
  initialValues?: Partial<DiaryFormValues>;
  submitButtonText?: string;
  onSubmit: (values: {
    date: string;
    emotion: string;
    sleepStart: string;
    sleepEnd: string;
    sleepHours: string;
    tookMedicine: boolean;
    medicineReaction: string;
    diary: string;
  }) => void;
};

const emotions: DiaryEmotion[] = [
  '좋음',
  '보통',
  '우울',
  '불안',
  '화남',
  '지침',
];

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
  const [date, setDate] = useState<Date>(initialValues?.date ?? new Date());
  const [selectedEmotion, setSelectedEmotion] = useState<string>(
    initialValues?.emotion ?? '',
  );
  const [sleepStart, setSleepStart] = useState<Date>(
    initialValues?.sleepStart ?? defaultSleepStart,
  );
  const [sleepEnd, setSleepEnd] = useState<Date>(
    initialValues?.sleepEnd ?? defaultSleepEnd,
  );
  const [tookMedicine, setTookMedicine] = useState<boolean | null>(
    initialValues?.tookMedicine ?? null,
  );
  const [medicineReaction, setMedicineReaction] = useState<string>(
    initialValues?.medicineReaction ?? '',
  );
  const [diary, setDiary] = useState<string>(initialValues?.diary ?? '');

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
    if (tookMedicine === false) {
      setMedicineReaction('');
    }
  }, [tookMedicine]);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!selectedEmotion) {
      nextErrors.emotion = '오늘의 감정을 선택해주세요.';
    }

    if (tookMedicine === null) {
      nextErrors.tookMedicine = '복약 여부를 선택해주세요.';
    }

    if (tookMedicine === true && !medicineReaction.trim()) {
      nextErrors.medicineReaction = '복약 후 반응을 입력해주세요.';
    }

    if (!diary.trim()) {
      nextErrors.diary = '오늘의 일기를 입력해주세요.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = useMemo((): boolean => {
    if (!selectedEmotion) return false;
    if (tookMedicine === null) return false;
    if (tookMedicine === true && !medicineReaction.trim()) return false;
    if (!diary.trim()) return false;
    return true;
  }, [selectedEmotion, tookMedicine, medicineReaction, diary]);

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
      date: formatDate(date),
      emotion: selectedEmotion,
      sleepStart: formatTime(sleepStart),
      sleepEnd: formatTime(sleepEnd),
      sleepHours: calculatedSleepHours,
      tookMedicine: tookMedicine as boolean,
      medicineReaction: tookMedicine ? medicineReaction : '',
      diary,
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
          <Text style={styles.label}>복약 여부</Text>
          <View style={styles.toggleContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                tookMedicine === true && styles.toggleButtonSelected,
                submitted && errors.tookMedicine && styles.inputErrorBorder,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setTookMedicine(true);
                if (submitted) {
                  setErrors(prev => ({ ...prev, tookMedicine: '' }));
                }
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  tookMedicine === true && styles.toggleTextSelected,
                ]}
              >
                복용함
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.toggleButton,
                tookMedicine === false && styles.toggleButtonSelected,
                submitted && errors.tookMedicine && styles.inputErrorBorder,
                pressed && styles.pressed,
              ]}
              onPress={() => {
                setTookMedicine(false);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    tookMedicine: '',
                    medicineReaction: '',
                  }));
                }
              }}
            >
              <Text
                style={[
                  styles.toggleText,
                  tookMedicine === false && styles.toggleTextSelected,
                ]}
              >
                복용 안 함
              </Text>
            </Pressable>
          </View>
          {submitted && errors.tookMedicine ? (
            <Text style={styles.errorText}>{errors.tookMedicine}</Text>
          ) : null}
        </View>

        {tookMedicine === true && (
          <View style={styles.section}>
            <Text style={styles.label}>복약 후 반응</Text>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                submitted && errors.medicineReaction && styles.inputErrorBorder,
              ]}
              placeholder="예: 졸림, 속이 메스꺼움, 별다른 변화 없음"
              value={medicineReaction}
              onChangeText={(text: string) => {
                setMedicineReaction(text);
                if (submitted) {
                  setErrors(prev => ({
                    ...prev,
                    medicineReaction: text.trim()
                      ? ''
                      : '복약 후 반응을 입력해주세요.',
                  }));
                }
              }}
              multiline
              textAlignVertical="top"
            />
            {submitted && errors.medicineReaction ? (
              <Text style={styles.errorText}>{errors.medicineReaction}</Text>
            ) : null}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>오늘의 일기</Text>
          <TextInput
            style={[
              styles.input,
              styles.diaryInput,
              submitted && errors.diary && styles.inputErrorBorder,
            ]}
            placeholder="오늘 있었던 일과 느낀 점을 적어보세요."
            value={diary}
            onChangeText={(text: string) => {
              setDiary(text);
              if (submitted) {
                setErrors(prev => ({
                  ...prev,
                  diary: text.trim() ? '' : '오늘의 일기를 입력해주세요.',
                }));
              }
            }}
            multiline
            textAlignVertical="top"
          />
          {submitted && errors.diary ? (
            <Text style={styles.errorText}>{errors.diary}</Text>
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
