/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Pressable,
  Text,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Icon } from '../components';
import { scale } from '../utils';
import {
  asyncCheckSurveyValid,
  asyncGetSurveyConfigApi,
  asyncSurveyRecoveryApi,
} from '../service';
import QuestionDataFormater, { formatSubmitParams } from '../utils/adapter';
import { QUESTION_CONTROL_TYPES, typeTagLabels } from '../models';
import type {
  // SurveySchemaData,
  ConfigResponseData,
  FormateConfigData,
  ControlProps,
  QUESTION_TYPE,
} from '../models';
import {
  SurveyRadio,
  SurveyCheckBox,
  SurveyInput,
  SurveyStar,
  SurveyNPS,
} from '../questions';
import type { SurveyOptions } from '../constants/interface';
import { useConfig } from '../configprovider';
import cardRenderStyles from './styles';

export const CardRender: React.FC<any> = (
  props: SurveyOptions & { container: 'card' | 'modal' }
) => {
  const {
    activityId,
    onSubmit,
    onSuccess,
    onError,
    onClose,
    container = 'modal',
  } = props;
  const formValues = useRef(new Map<string, any>());
  const startTime = useRef(Date.now());
  const [curIndex, setCurIndex] = useState(0);
  const [data, setData] = useState<FormateConfigData | null>(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useConfig();
  const styles = cardRenderStyles(theme);

  const getSurveyConfig = async () => {
    try {
      const { data: channelData, error } = await asyncCheckSurveyValid();
      if (error) {
        setLoading(false);
        onError && onError(error);
        return;
      }

      // 判断show里传入activityId是否等于channel关联的SurveyPath
      if (channelData?.surveyPath !== activityId) {
        setLoading(false);
        onError && onError(new Error('surveyPath is invalid'));
        return;
      }

      const { data: resData } = await asyncGetSurveyConfigApi({
        activityId,
      });
      // @todo: 取全局的surveyId和activityId传入
      const formateData = new QuestionDataFormater({
        title: (resData.data as any).title,
        // surveyId: (resData.data as any).surveyConf.pageId,
        activityId,
        data: (resData.data as any).code as ConfigResponseData,
      }).formateData();
      setData(formateData);
      setLoading(false);
      onSuccess && onSuccess();
    } catch (error: any) {
      onError && onError(error);
    }
  };

  useEffect(() => {
    getSurveyConfig();
  }, []);

  const curQuestion = useMemo(() => {
    const list = data?.questionList || [];
    return list[curIndex];
  }, [data, curIndex]);

  const onBtnChange = ({ field, value }: { field: string; value: any }) => {
    formValues.current.set(field, value);
  };

  const renderHeader = (question?: ControlProps) => {
    if (!question) {
      return null;
    }
    const { title, index, type } = question;
    return (
      <>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={0}>
            {`${index}. ${title}`}
          </Text>
          <View style={styles.tagWrap}>
            <Text style={styles.tagText}>
              {typeTagLabels[type as QUESTION_TYPE]}
            </Text>
          </View>
        </View>
        {container === 'modal' ? (
          <Icon
            name="close"
            size={scale(46)}
            onPress={onClose}
            style={styles.closeIcon}
          />
        ) : null}
      </>
    );
  };

  const renderQuestion = (question?: ControlProps) => {
    if (!question) {
      return null;
    }
    const { type } = question || {};
    if (QUESTION_CONTROL_TYPES.RADIO.includes(type)) {
      return (
        <SurveyRadio
          {...question}
          isVertical={true}
          onBtnChange={onBtnChange}
          formValue={formValues.current}
        />
      );
    } else if (QUESTION_CONTROL_TYPES.CHECKBOX.includes(type)) {
      return (
        <SurveyCheckBox
          {...question}
          isVertical={true}
          onBtnChange={onBtnChange}
          formValue={formValues.current}
        />
      );
    } else if (QUESTION_CONTROL_TYPES.TEXT.includes(type)) {
      return (
        <SurveyInput
          {...question}
          onBtnChange={onBtnChange}
          formValue={formValues.current}
        />
      );
    } else if (QUESTION_CONTROL_TYPES.STAR.includes(type)) {
      return (
        <SurveyStar
          {...question}
          onBtnChange={onBtnChange}
          formValue={formValues.current}
        />
      );
    } else if (QUESTION_CONTROL_TYPES.NPS.includes(type)) {
      return (
        <SurveyNPS
          {...question}
          onBtnChange={onBtnChange}
          formValue={formValues.current}
        />
      );
    }
    return null;
  };

  const onPrevClick = () => {
    setCurIndex(curIndex - 1);
  };

  const onNextClick = () => {
    setCurIndex(curIndex + 1);
  };

  const submit = async () => {
    setLoading(true);
    try {
      const params = formatSubmitParams({
        formValues: formValues.current,
        activityId,
        startTime: startTime.current,
      });
      await asyncSurveyRecoveryApi(params);
      setLoading(false);
      onSubmit && onSubmit(1);
    } catch (error) {
      setLoading(false);
      onSubmit && onSubmit(0);
    }
  };

  return (
    <View style={[styles.container]}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <ImageBackground
            source={theme!.headerImage}
            style={styles.headerImage}
            resizeMode="cover"
          >
            <View style={styles.headerWrap}>{renderHeader(curQuestion)}</View>
          </ImageBackground>
          <View style={styles.questionWrap}>{renderQuestion(curQuestion)}</View>
          <View style={styles.bottomBtn}>
            {curQuestion?.hasPrev ? (
              <Pressable
                style={[styles.btn, styles.prevBorder]}
                onPress={onPrevClick}
              >
                <Text style={styles.prevText}>上一题</Text>
              </Pressable>
            ) : null}
            {curQuestion?.hasNext ? (
              <Pressable
                style={[styles.btn, styles.activeBorder]}
                onPress={onNextClick}
              >
                <Text style={styles.activeText}>下一题</Text>
              </Pressable>
            ) : null}
            {curQuestion?.lastQuestion ? (
              <Pressable
                style={[styles.btn, styles.activeBorder]}
                onPress={submit}
              >
                <Text style={styles.activeText}>提交</Text>
              </Pressable>
            ) : null}
          </View>
        </>
      )}
    </View>
  );
};

CardRender.displayName = 'CardRender';
