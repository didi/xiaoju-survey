export interface DataSecurityPlugin {
  isDataSensitive(data: string): boolean;
  encryptData(data: string): string;
  decryptData(data: string): string;
  desensitiveData(data: string): string;
}