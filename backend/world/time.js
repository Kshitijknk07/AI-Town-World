import { query } from "../data/db.js";
import logger from "../utils/logger.js";
import config from "../config/config.js";

class WorldTime {
  constructor() {
    this.currentTime = new Date();
    this.day = 1;
    this.hour = 10;
    this.minute = 30;
    this.speed = "normal";
    this.isRunning = true;
    this.tickInterval = null;
  }

  // Initialize world time from database
  async initialize() {
    try {
      const result = await query("SELECT * FROM world_state WHERE id = 1");
      if (result.rows.length > 0) {
        const worldState = result.rows[0];
        this.currentTime = new Date(worldState.current_time);
        this.day = worldState.day;
        this.hour = worldState.hour;
        this.minute = worldState.minute;
        this.speed = worldState.speed;
        this.isRunning = worldState.is_running;
      }

      logger.info("World time initialized", {
        day: this.day,
        time: `${this.hour}:${this.minute.toString().padStart(2, "0")}`,
        speed: this.speed,
        isRunning: this.isRunning,
      });
    } catch (error) {
      logger.error("Failed to initialize world time", { error: error.message });
      throw error;
    }
  }

  // Start the time simulation
  start() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
    }

    this.isRunning = true;
    this.tickInterval = setInterval(() => {
      this.tick();
    }, config.simulation.tickInterval);

    logger.info("World time simulation started", {
      tickInterval: config.simulation.tickInterval,
      timeScale: config.simulation.timeScale,
    });
  }

  // Stop the time simulation
  stop() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
    this.isRunning = false;

    logger.info("World time simulation stopped");
  }

  // Advance time by one tick
  async tick() {
    if (!this.isRunning) return;

    try {
      // Calculate time advancement based on speed
      const timeAdvancement = this.getTimeAdvancement();

      // Advance time
      this.advanceTime(timeAdvancement);

      // Update database
      await this.updateDatabase();

      logger.debug("World time tick", {
        day: this.day,
        time: `${this.hour}:${this.minute.toString().padStart(2, "0")}`,
        advancement: timeAdvancement,
      });
    } catch (error) {
      logger.error("World time tick failed", { error: error.message });
    }
  }

  // Get time advancement based on current speed
  getTimeAdvancement() {
    const baseAdvancement = config.simulation.timeScale; // minutes per tick

    switch (this.speed) {
      case "pause":
        return 0;
      case "slow":
        return Math.floor(baseAdvancement * 0.5);
      case "normal":
        return baseAdvancement;
      case "fast":
        return baseAdvancement * 3;
      default:
        return baseAdvancement;
    }
  }

  // Advance time by specified minutes
  advanceTime(minutes) {
    if (minutes <= 0) return;

    // Add minutes to current time
    this.currentTime.setMinutes(this.currentTime.getMinutes() + minutes);

    // Update hour and minute
    this.hour = this.currentTime.getHours();
    this.minute = this.currentTime.getMinutes();

    // Check if day has passed
    const previousDay = this.day;
    this.day =
      Math.floor(this.currentTime.getTime() / (24 * 60 * 60 * 1000)) + 1;

    if (this.day > previousDay) {
      logger.info("New day started", { day: this.day });
    }
  }

  // Update database with current time state
  async updateDatabase() {
    try {
      await query(
        `UPDATE world_state 
         SET current_time = $1, day = $2, hour = $3, minute = $4, speed = $5, is_running = $6, updated_at = $7 
         WHERE id = 1`,
        [
          this.currentTime,
          this.day,
          this.hour,
          this.minute,
          this.speed,
          this.isRunning,
          new Date(),
        ]
      );
    } catch (error) {
      logger.error("Failed to update world time in database", {
        error: error.message,
      });
    }
  }

  // Set simulation speed
  async setSpeed(speed) {
    if (!["pause", "slow", "normal", "fast"].includes(speed)) {
      throw new Error("Invalid speed value");
    }

    this.speed = speed;

    // Update running state based on speed
    this.isRunning = speed !== "pause";

    // Restart simulation if needed
    if (this.isRunning && !this.tickInterval) {
      this.start();
    } else if (!this.isRunning && this.tickInterval) {
      this.stop();
    }

    await this.updateDatabase();

    logger.info("World time speed changed", {
      speed,
      isRunning: this.isRunning,
    });
  }

  // Get current time state
  getCurrentTime() {
    return {
      currentTime: this.currentTime,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      speed: this.speed,
      isRunning: this.isRunning,
    };
  }

  // Get formatted time string
  getFormattedTime() {
    return {
      time: `${this.hour}:${this.minute.toString().padStart(2, "0")}`,
      day: this.day,
      speed: this.speed,
      isRunning: this.isRunning,
    };
  }

  // Check if it's a specific time of day
  isTimeOfDay(startHour, endHour) {
    return this.hour >= startHour && this.hour < endHour;
  }

  // Check if it's daytime (6 AM to 6 PM)
  isDaytime() {
    return this.isTimeOfDay(6, 18);
  }

  // Check if it's nighttime (6 PM to 6 AM)
  isNighttime() {
    return !this.isDaytime();
  }

  // Check if it's morning (6 AM to 12 PM)
  isMorning() {
    return this.isTimeOfDay(6, 12);
  }

  // Check if it's afternoon (12 PM to 6 PM)
  isAfternoon() {
    return this.isTimeOfDay(12, 18);
  }

  // Check if it's evening (6 PM to 12 AM)
  isEvening() {
    return this.isTimeOfDay(18, 24);
  }

  // Check if it's late night (12 AM to 6 AM)
  isLateNight() {
    return this.hour >= 0 && this.hour < 6;
  }

  // Get time of day description
  getTimeOfDayDescription() {
    if (this.isMorning()) return "morning";
    if (this.isAfternoon()) return "afternoon";
    if (this.isEvening()) return "evening";
    if (this.isLateNight()) return "late night";
    return "night";
  }

  // Get time context for agents
  getTimeContext() {
    return {
      time: this.getFormattedTime(),
      isDaytime: this.isDaytime(),
      isNighttime: this.isNighttime(),
      timeOfDay: this.getTimeOfDayDescription(),
      day: this.day,
    };
  }

  // Reset time to default
  async reset() {
    this.currentTime = new Date();
    this.currentTime.setHours(10, 30, 0, 0); // 10:30 AM
    this.day = 1;
    this.hour = 10;
    this.minute = 30;
    this.speed = "normal";
    this.isRunning = true;

    await this.updateDatabase();

    // Restart simulation
    this.start();

    logger.info("World time reset to default");
  }

  // Cleanup
  cleanup() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}

export default new WorldTime();
