import { LocationResponse, DeviceStatus } from '@/types';

const MG_API_BASE = 'http://open.4s12580.com/open/v1';
const MG_APP_KEY = '6692d10baf2065b72d54c81ad8e2a409';
const DEVICE_IMEI = process.env.NEXT_PUBLIC_MG_IMEI || '869497051843322';

// 获取设备实时位置
export async function fetchDeviceLocation(imei?: string): Promise<DeviceStatus | null> {
  const deviceImei = imei || DEVICE_IMEI;
  
  try {
    const response = await fetch(`${MG_API_BASE}/GetRealtimeTrackList?appkey=${MG_APP_KEY}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        device_id: [deviceImei],
        map_coord_type: 2, // 2 = 高德坐标
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LocationResponse = await response.json();

    if (data.error !== 0 || !data.result || data.result.length === 0) {
      console.error('API error:', data.reason);
      return null;
    }

    const track = data.result[0];

    // 模拟温湿度（设备未接传感器）
    const temperature = 26;  // 固定 26°C
    const humidity = 60;     // 固定 60%

    // 计算当日里程（总里程 - 当日 0 点里程）
    const todayMileage = track.mileage - track.theday_init_mileage;

    return {
      imei: track.device_id,
      // 使用目标坐标（已转换为高德坐标）
      lat: track.target_gps_lat,
      lng: track.target_gps_lon,
      // 位置信息
      location: `${track.province_name}${track.city_name}${track.region_name}`,
      address: track.region_name,
      // 状态
      isOnline: track.is_online === 1,
      drivingStatus: track.driving_status === 1, // 1=启动，0=熄火
      accStatus: track.acc === 1, // 1=启动，0=熄火
      // 速度和方向
      speed: track.speed,
      direction: track.direct,
      altitude: track.altitude,
      // 信号
      gpsSignal: track.gps_signal,
      beidouSignal: track.beidou_signal,
      gsmSignal: track.gsm_signal,
      gpsFlag: track.gps_flag, // 0=GPS, 2=基站，3=WiFi
      // 里程
      totalMileage: track.mileage,
      todayMileage: todayMileage,
      // 电池和油量
      voltage: track.voltage,
      oilLevel: track.oil_num,
      // 温湿度
      temperature,
      humidity,
      // 时间
      gpsTime: track.gps_time,
      receiveTime: track.rcv_time,
      // 报警
      isAlarm: track.alarm_flag === 1,
      alarmType: track.alarm_type,
      alarmDesc: track.alarm_desc,
      // 原始数据
      rawData: track,
    };
  } catch (error) {
    console.error('Failed to fetch device location:', error);
    return null;
  }
}

// AI 分析 API（通过 Next.js API Route 代理）
export async function analyzeImage(imageBase64: string, prompt?: string) {
  try {
    const response = await fetch('/api/ai-analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64,
        prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI analysis failed:', error);
    throw error;
  }
}
