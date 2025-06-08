
export class AgeCalculator {
  static calculateBabyAgeInMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    const diffInMs = now.getTime() - birth.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
  }
}
