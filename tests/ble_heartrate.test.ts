import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BleHeartRateParser,
  AerobicZoneCalculator,
  HeartRateZone,
} from "../packages/core/src/ble_heartrate.js";

describe("BLE Heart Rate & Aerobic Zone Engine", () => {
  it("parses standard 8-bit BPM packet without RR-intervals", () => {
    // Flags: 0x00 (8-bit BPM, contact not supported, no energy, no RR)
    // BPM: 75
    const buffer = new Uint8Array([0x00, 75]).buffer;
    const dataView = new DataView(buffer);

    const result = BleHeartRateParser.parse(dataView);
    assert.equal(result.heartRateBpm, 75);
    assert.equal(result.sensorContact, true);
    assert.equal(result.rrIntervalsMs.length, 0);
  });

  it("parses 16-bit BPM packet with sensor contact and energy expended", () => {
    // Flags: 0x01 | 0x06 | 0x08 = 0x0F (16-bit BPM, contact detected, energy expended)
    // BPM: 165 (0x00A5 -> little endian: 0xA5, 0x00)
    // Energy Expended: 320 Joules (0x0140 -> little endian: 0x40, 0x01)
    const buffer = new Uint8Array([0x0f, 0xa5, 0x00, 0x40, 0x01]).buffer;
    const dataView = new DataView(buffer);

    const result = BleHeartRateParser.parse(dataView);
    assert.equal(result.heartRateBpm, 165);
    assert.equal(result.sensorContact, true);
    assert.equal(result.energyExpendedJoules, 320);
  });

  it("parses packet containing multiple RR-intervals and computes rMSSD", () => {
    // Flags: 0x10 (8-bit BPM, RR-intervals present)
    // BPM: 120
    // RR 1: 820ms (~840 / 1024 * 1000 = 820ms -> raw 840 = 0x0348 -> 0x48, 0x03)
    // RR 2: 800ms (~819 / 1024 * 1000 = 800ms -> raw 819 = 0x0333 -> 0x33, 0x03)
    const buffer = new Uint8Array([0x10, 120, 0x48, 0x03, 0x33, 0x03]).buffer;
    const dataView = new DataView(buffer);

    const result = BleHeartRateParser.parse(dataView);
    assert.equal(result.heartRateBpm, 120);
    assert.equal(result.rrIntervalsMs.length, 2);
    assert.equal(result.rrIntervalsMs[0], 820);
    assert.equal(result.rrIntervalsMs[1], 800);

    const rmssd = AerobicZoneCalculator.calculateRmssd(result.rrIntervalsMs);
    assert.equal(rmssd, 20); // sqrt((800-820)^2 / 1) = 20
  });

  it("calculates accurate aerobic heart rate zones across intensities", () => {
    const profile = { restingHrBpm: 55, maxHrBpm: 190 };

    // Zone 1: <60% (100 BPM / 190 = 53%)
    const z1 = AerobicZoneCalculator.calculateZone(100, profile);
    assert.equal(z1.zone, HeartRateZone.Zone1Recovery);

    // Zone 2: 60-70% (125 BPM / 190 = 66%)
    const z2 = AerobicZoneCalculator.calculateZone(125, profile);
    assert.equal(z2.zone, HeartRateZone.Zone2AerobicBase);

    // Zone 3: 70-80% (145 BPM / 190 = 76%)
    const z3 = AerobicZoneCalculator.calculateZone(145, profile);
    assert.equal(z3.zone, HeartRateZone.Zone3Tempo);

    // Zone 4: 80-90% (165 BPM / 190 = 87%)
    const z4 = AerobicZoneCalculator.calculateZone(165, profile);
    assert.equal(z4.zone, HeartRateZone.Zone4Threshold);

    // Zone 5: >90% (180 BPM / 190 = 95%)
    const z5 = AerobicZoneCalculator.calculateZone(180, profile);
    assert.equal(z5.zone, HeartRateZone.Zone5Anaerobic);
  });
});
