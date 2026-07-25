import * as Audio from 'expo-av';
import { Audio as AudioModule } from 'expo-av';

export class AudioMuteService {
  private static muteSchedules: Map<string, NodeJS.Timer> = new Map();

  static async initialize() {
    // Request audio permissions
    try {
      await Audio.requestPermissionsAsync();
    } catch (error) {
      console.error('Audio permission error:', error);
    }
  }

  /**
   * Enable silent/vibrate mode during class times
   * @param classSessionId - ID of the class session
   * @param startTime - Start time in HH:mm format
   * @param endTime - End time in HH:mm format
   * @param muteType - 'silent' or 'vibrate'
   */
  static async scheduleClassMute(
    classSessionId: string,
    startTime: string,
    endTime: string,
    muteType: 'silent' | 'vibrate' = 'vibrate'
  ) {
    const now = new Date();
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0);
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute, 0);

    // If times have already passed today, schedule for next occurrence
    if (startDate < now) {
      startDate.setDate(startDate.getDate() + 1);
      endDate.setDate(endDate.getDate() + 1);
    }

    const timeUntilStart = startDate.getTime() - now.getTime();
    const durationOfClass = endDate.getTime() - startDate.getTime();

    // Clear any existing schedule for this session
    if (this.muteSchedules.has(classSessionId)) {
      clearTimeout(this.muteSchedules.get(classSessionId));
    }

    // Schedule mute at class start
    const startMuteTimeout = setTimeout(async () => {
      await this.applyMute(muteType);
      console.log(`Applied ${muteType} mode for class ${classSessionId}`);

      // Schedule unmute at class end
      const endMuteTimeout = setTimeout(async () => {
        await this.applyUnmute();
        console.log(`Removed ${muteType} mode for class ${classSessionId}`);
        this.muteSchedules.delete(classSessionId);
      }, durationOfClass);

      this.muteSchedules.set(classSessionId, endMuteTimeout);
    }, timeUntilStart);

    this.muteSchedules.set(classSessionId, startMuteTimeout);
  }

  /**
   * Apply silent or vibrate mode
   */
  private static async applyMute(muteType: 'silent' | 'vibrate') {
    try {
      if (muteType === 'silent') {
        await AudioModule.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpiece: false,
        });
      } else if (muteType === 'vibrate') {
        // Vibrate mode - similar to silent but might play through earpiece
        await AudioModule.setAudioModeAsync({
          allowsRecordingIOS: false,
          interruptionModeIOS: Audio.InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: false,
          staysActiveInBackground: false,
          interruptionModeAndroid: Audio.InterruptionModeAndroid.DoNotMix,
          shouldDuckAndroid: true,
          playThroughEarpiece: false,
        });
      }
    } catch (error) {
      console.error('Error applying mute:', error);
    }
  }

  /**
   * Remove mute and return to normal mode
   */
  private static async applyUnmute() {
    try {
      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.InterruptionModeIOS.Default,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeAndroid: Audio.InterruptionModeAndroid.Default,
        shouldDuckAndroid: false,
        playThroughEarpiece: true,
      });
    } catch (error) {
      console.error('Error applying unmute:', error);
    }
  }

  /**
   * Cancel a scheduled mute
   */
  static cancelMute(classSessionId: string) {
    if (this.muteSchedules.has(classSessionId)) {
      clearTimeout(this.muteSchedules.get(classSessionId));
      this.muteSchedules.delete(classSessionId);
      console.log(`Cancelled mute schedule for class ${classSessionId}`);
    }
  }
}
