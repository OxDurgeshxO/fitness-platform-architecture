/**
 * Bluetooth Low Energy (BLE) Heart Rate Measurement Parser & Aerobic Zone Calculator
 * Conforms to Bluetooth SIG GATT Heart Rate Service (0x180D / 0x2A37).
 */

export enum HeartRateZone {
  Zone1Recovery = "Zone 1 (Active Recovery)",
  Zone2AerobicBase = "Zone 2 (Aerobic Base)",
  Zone3Tempo = "Zone 3 (Tempo / Endurance)",
  Zone4Threshold = "Zone 4 (Lactate Threshold)",
  Zone5Anaerobic = "Zone 5 (Anaerobic / VO2 Max)",
}

export interface BleHeartRateMeasurement {
  heartRateBpm: number;
  sensorContact: boolean;
  energyExpendedJoules?: number;
  rrIntervalsMs: number[];
  timestampMs: number;
}

export interface AthleteHeartRateProfile {
  restingHrBpm: number;
  maxHrBpm: number;
  age?: number;
}

export class BleHeartRateParser {
  /**
   * Parses raw byte payload received from GATT characteristic 0x2A37.
   */
  public static parse(dataView: DataView): BleHeartRateMeasurement {
    if (dataView.byteLength < 2) {
      throw new Error("BLE Heart Rate packet too short: expected minimum 2 bytes");
    }

    const flags = dataView.getUint8(0);
    const is16Bit = (flags & 0x01) !== 0;
    const contactSupported = (flags & 0x04) !== 0;
    const contactDetected = (flags & 0x02) !== 0;
    const energyExpendedPresent = (flags & 0x08) !== 0;
    const rrIntervalsPresent = (flags & 0x10) !== 0;

    let offset = 1;
    let heartRateBpm: number;

    if (is16Bit) {
      heartRateBpm = dataView.getUint16(offset, true /* little-endian */);
      offset += 2;
    } else {
      heartRateBpm = dataView.getUint8(offset);
      offset += 1;
    }

    let energyExpendedJoules: number | undefined;
    if (energyExpendedPresent && offset + 2 <= dataView.byteLength) {
      energyExpendedJoules = dataView.getUint16(offset, true);
      offset += 2;
    }

    const rrIntervalsMs: number[] = [];
    if (rrIntervalsPresent) {
      while (offset + 2 <= dataView.byteLength) {
        // Raw RR interval is in 1/1024 second units -> convert to milliseconds
        const rawInterval = dataView.getUint16(offset, true);
        const intervalMs = Math.round((rawInterval / 1024) * 1000);
        rrIntervalsMs.push(intervalMs);
        offset += 2;
      }
    }

    return {
      heartRateBpm,
      sensorContact: contactSupported ? contactDetected : true,
      energyExpendedJoules,
      rrIntervalsMs,
      timestampMs: Date.now(),
    };
  }
}

export class AerobicZoneCalculator {
  /**
   * Calculates athlete maximum heart rate using the Tanaka formula: HR_max = 208 - (0.7 * age)
   */
  public static estimateMaxHeartRate(age: number): number {
    return Math.round(208 - 0.7 * age);
  }

  /**
   * Maps current heart rate to aerobic zone.
   */
  public static calculateZone(currentBpm: number, profile: AthleteHeartRateProfile): {
    zone: HeartRateZone;
    pctMax: number;
    color: string;
  } {
    const pctMax = Math.min(100, Math.max(0, Math.round((currentBpm / profile.maxHrBpm) * 100)));

    if (pctMax < 60) {
      return { zone: HeartRateZone.Zone1Recovery, pctMax, color: "#3B82F6" /* Blue */ };
    } else if (pctMax < 70) {
      return { zone: HeartRateZone.Zone2AerobicBase, pctMax, color: "#10B981" /* Green */ };
    } else if (pctMax < 80) {
      return { zone: HeartRateZone.Zone3Tempo, pctMax, color: "#F59E0B" /* Yellow/Amber */ };
    } else if (pctMax < 90) {
      return { zone: HeartRateZone.Zone4Threshold, pctMax, color: "#F97316" /* Orange */ };
    } else {
      return { zone: HeartRateZone.Zone5Anaerobic, pctMax, color: "#EF4444" /* Red */ };
    }
  }

  /**
   * Computes rMSSD (Root Mean Square of Successive Differences) from RR-intervals for HRV score.
   */
  public static calculateRmssd(rrIntervalsMs: number[]): number {
    if (rrIntervalsMs.length < 2) return 0;

    let sumSquaredDiffs = 0;
    for (let i = 1; i < rrIntervalsMs.length; i++) {
      const diff = rrIntervalsMs[i] - rrIntervalsMs[i - 1];
      sumSquaredDiffs += diff * diff;
    }

    return Math.round(Math.sqrt(sumSquaredDiffs / (rrIntervalsMs.length - 1)));
  }
}
