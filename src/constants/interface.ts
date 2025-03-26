export interface SurveyOptions {
  activityId: string;
  type?: 'card' | 'list';
  position?: 'bottom' | 'middle' | 'top';
  mask?: boolean;
  containerStyle?: any;
  contentStyle?: any;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
  onSubmit?: (result: number) => void;
}
