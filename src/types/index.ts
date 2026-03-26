// Device Types
export interface DeviceStatus {
  imei: string;
  // 位置信息
  lat: number;
  lng: number;
  location: string;
  address: string;
  altitude: number;
  // 状态
  isOnline: boolean;
  drivingStatus: boolean; // 1=启动，0=熄火
  accStatus: boolean; // 1=启动，0=熄火
  isAlarm: boolean;
  // 速度和方向
  speed: number;
  direction: number;
  // 信号
  gpsSignal: number; // GPS 卫星颗数
  beidouSignal: number; // 北斗卫星颗数
  gsmSignal: number; // GSM 信号强度
  gpsFlag: number; // 0=GPS, 2=基站，3=WiFi
  // 里程
  totalMileage: number; // 总里程（米）
  todayMileage: number; // 今日里程（米）
  // 电池和油量
  voltage: number;
  oilLevel: number;
  // 温湿度
  temperature: number;
  humidity: number;
  // 时间
  gpsTime: string;
  receiveTime: string;
  // 报警
  alarmType: string;
  alarmDesc: string;
  // 原始数据
  rawData?: any;
}

// AI Analysis Types
export interface AIAnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  petStatus: 'normal' | 'stress' | 'unknown';
  abnormalities: string[];
  suggestions: string[];
  rawResponse: string;
}

// Live Stream Types
export type LiveStatus = 'idle' | 'connecting' | 'connected' | 'error';
export type PlayerMode = 'live' | 'demo';

export interface LiveStreamState {
  status: LiveStatus;
  mode: PlayerMode;
  currentDemoImage: string | null;
  error: string | null;
}

// History Types
export interface ScreenshotRecord {
  id: string;
  timestamp: number;
  imageUrl: string;
  type: 'screenshot' | 'demo';
}

export interface HistoryState {
  screenshots: ScreenshotRecord[];
  analysis: AIAnalysisResult[];
}

// Settings Types
export interface AppSettings {
  language: 'zh' | 'en' | 'ja';
  aiPrompt: string;
  demoMode: boolean;
}

// API Types
export interface LocationResponse {
  error: number;
  reason: string;
  result: Array<{
    device_id: string;
    rcv_time: string;
    driving_status: number;
    is_online: number;
    theday_init_mileage: number;
    mileage: number;
    voltage: number;
    speed: number;
    altitude: number;
    direct: number;
    oil_num: number;
    status_desc: string;
    beidou_signal: number;
    gps_signal: number;
    gsm_signal: number;
    alarm_flag: number;
    alarm_type: string;
    alarm_desc: string;
    province_name: string;
    city_name: string;
    region_name: string;
    gps_flag: number;
    gps_lon: number;
    gps_lat: number;
    target_gps_lon: number;
    target_gps_lat: number;
    gps_time: string;
    lbs_lon: number;
    lbs_lat: number;
    target_lbs_lon: number;
    target_lbs_lat: number;
    lbs_time: string;
    wifi_lon: number;
    wifi_lat: number;
    target_wifi_lon: number;
    target_wifi_lat: number;
    wifi_time: string;
    acc: number;
    etc: any;
    temperature: number[];
    humidity: number[];
  }>;
}

export interface AIAnalyzeRequest {
  imageBase64: string;
  prompt?: string;
}

export interface AIAnalyzeResponse {
  status: 'success' | 'error';
  result?: AIAnalysisResult;
  error?: string;
}
