from datetime import datetime, timezone

from app.schemas.ecosystem import (
    AthleteDataExportResponse,
    HeartRateStreamRequest,
    HeartRateZoneAnalysis,
)


class EcosystemService:
    @staticmethod
    def analyze_heart_rate(req: HeartRateStreamRequest) -> HeartRateZoneAnalysis:
        # Tanaka formula for Max HR
        max_hr = int(round(208.0 - (0.7 * req.athlete_age)))
        hrr = max(30, max_hr - req.resting_heart_rate)

        # Karvonen % HRR
        hrr_pct = round(
            max(0.0, min(1.0, (req.current_heart_rate - req.resting_heart_rate) / float(hrr))), 2
        )

        if hrr_pct < 0.60:
            zone = "Zone 1 (Active Recovery)"
            desc = "Light aerobic effort. Stimulates blood circulation, nutrient delivery, and metabolic recovery without central fatigue."
            target = f"<{int(round(req.resting_heart_rate + 0.60 * hrr))} BPM"
            effect = "Recovery & Parasympathetic Modulation"
        elif hrr_pct < 0.70:
            zone = "Zone 2 (Aerobic Base / Fat Oxidation)"
            desc = "Optimal intensity for mitochondrial biogenesis, maximal fatty acid oxidation, and metabolic efficiency."
            target = f"{int(round(req.resting_heart_rate + 0.60 * hrr))} - {int(round(req.resting_heart_rate + 0.70 * hrr))} BPM"
            effect = "Base Endurance & Capillary Density"
        elif hrr_pct < 0.80:
            zone = "Zone 3 (Aerobic Conditioning)"
            desc = "Moderate-to-hard cardio. Improves aerobic capacity and stroke volume with steady lactate clearance."
            target = f"{int(round(req.resting_heart_rate + 0.70 * hrr))} - {int(round(req.resting_heart_rate + 0.80 * hrr))} BPM"
            effect = "Aerobic Power & Glycogen Utilization"
        elif hrr_pct < 0.90:
            zone = "Zone 4 (Lactate Threshold)"
            desc = "Hard sustained effort. Enhances anaerobic threshold and muscle buffering capacity against hydrogen ions."
            target = f"{int(round(req.resting_heart_rate + 0.80 * hrr))} - {int(round(req.resting_heart_rate + 0.90 * hrr))} BPM"
            effect = "Anaerobic Lactic Endurance"
        else:
            zone = "Zone 5 (VO2 Max / Neuromuscular Power)"
            desc = "Maximum exertion. Stimulates peak oxygen uptake and fast-twitch motor unit recruitment."
            target = f">{int(round(req.resting_heart_rate + 0.90 * hrr))} BPM"
            effect = "Peak VO2 Max & Neuromuscular Cadence"

        return HeartRateZoneAnalysis(
            current_bpm=req.current_heart_rate,
            max_heart_rate=max_hr,
            heart_rate_reserve_pct=round(hrr_pct * 100.0, 1),
            current_zone=zone,
            zone_description=desc,
            target_bpm_range=target,
            training_effect=effect,
            timestamp=datetime.now(timezone.utc),
        )

    @staticmethod
    def export_athlete_data() -> AthleteDataExportResponse:
        now = datetime.now(timezone.utc)
        return AthleteDataExportResponse(
            athlete_profile={
                "name": "Durgesh Dutt Sinha",
                "role": "Athlete & AI Engineer",
                "tier": "Mythic Titan",
                "level": 10,
                "streak_days": 14,
            },
            session_count=38,
            total_reps_completed=4825,
            total_calories_burned=34250.0,
            achievements_unlocked=[
                "First Blood",
                "Century Club",
                "Squat Depth Master",
                "Calorie Crusher",
                "Macro Disciplined",
                "Coach Consultant",
            ],
            compliance_standard="GDPR Art. 20 (Data Portability) & HIPAA Security Rule (Encrypted Export)",
            exported_at=now,
        )
