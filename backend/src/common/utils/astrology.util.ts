export class AstrologyUtil {
  /**
   * Calculate Western Horoscope based on birthday (month and day)
   * @param birthday Date object
   * @returns Horoscope sign
   */
  static calculateHoroscope(birthday: Date): string {
    const month = birthday.getMonth() + 1; // getMonth() returns 0-11
    const day = birthday.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
      return 'Aries';
    } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
      return 'Taurus';
    } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
      return 'Gemini';
    } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
      return 'Cancer';
    } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
      return 'Leo';
    } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
      return 'Virgo';
    } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
      return 'Libra';
    } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
      return 'Scorpio';
    } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
      return 'Sagittarius';
    } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      return 'Capricorn';
    } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
      return 'Aquarius';
    } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
      return 'Pisces';
    }

    return 'Unknown';
  }

  /**
   * Calculate Chinese Zodiac based on birth year
   * @param birthYear Year as number
   * @returns Chinese zodiac animal
   */
  static calculateZodiac(birthYear: number): string {
    const zodiacAnimals = [
      'Rat', // 0
      'Ox', // 1
      'Tiger', // 2
      'Rabbit', // 3
      'Dragon', // 4
      'Snake', // 5
      'Horse', // 6
      'Goat', // 7
      'Monkey', // 8
      'Rooster', // 9
      'Dog', // 10
      'Pig', // 11
    ];

    // The Chinese zodiac cycle started in 4 AD
    // Formula: (year - 4) % 12
    const index = (birthYear - 4) % 12;
    return zodiacAnimals[index];
  }

  /**
   * Calculate age from birthday
   * @param birthday Date object
   * @returns Age in years
   */
  static calculateAge(birthday: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();

    // If birthday hasn't occurred this year yet, subtract 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }

    return age;
  }
}
