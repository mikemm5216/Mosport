from datetime import datetime, timedelta, timezone

class FrequencyController:
    # Frequency Constants (in seconds)
    FREQ_HOT = 300      # 5 minutes
    FREQ_WARM = 3600    # 1 hour
    FREQ_COOL = 21600   # 6 hours
    FREQ_COLD = 86400   # 24 hours

    @staticmethod
    def get_tier(start_time: datetime, status: str = "scheduled") -> str:
        now = datetime.now(timezone.utc)
        
        # Ensure start_time is timezone aware, assuming UTC if not set
        if start_time.tzinfo is None:
            start_time = start_time.replace(tzinfo=timezone.utc)

        # 1. HOT Check
        # If event is marked LIVE or start_time is within the next 2 hours or started less than 3 hours ago
        time_diff = start_time - now
        
        if status.lower() == "live":
            return "HOT"
        
        # Event is about to start (within 2 hours) or just started (within 3 hours ago)
        if -timedelta(hours=3) <= time_diff <= timedelta(hours=2):
            return "HOT"

        # 2. WARM Check (Within next 24 hours)
        if timedelta(hours=2) < time_diff <= timedelta(hours=24):
            return "WARM"

        # 3. COOL Check (Within next 7 days)
        if timedelta(hours=24) < time_diff <= timedelta(days=7):
            return "COOL"

        # 4. COLD Check (More than 7 days away)
        return "COLD"

    @classmethod
    def determine_next_check(cls, start_time: datetime, status: str = "scheduled") -> int:
        """
        Returns the number of seconds to wait before the next check.
        """
        tier = cls.get_tier(start_time, status)
        
        if tier == "HOT":
            return cls.FREQ_HOT
        elif tier == "WARM":
            return cls.FREQ_WARM
        elif tier == "COOL":
            return cls.FREQ_COOL
        else: # COLD
            return cls.FREQ_COLD

slme = FrequencyController()
