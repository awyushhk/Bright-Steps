export const AgeGroup = {
  MONTHS_6_12: '6-12 months',
  MONTHS_12_18: '12-18 months',
  MONTHS_18_24: '18-24 months',
  MONTHS_24_36: '24-36 months',
  YEARS_3_5: '3-5 years',
};

export function calculateAgeInMonths(dateOfBirth) {
  const today = new Date();
  const dob = new Date(dateOfBirth);
  const months =
    (today.getFullYear() - dob.getFullYear()) * 12 +
    (today.getMonth() - dob.getMonth());
  return months;
}

export function getAgeGroup(dateOfBirth) {
  const ageInMonths = calculateAgeInMonths(dateOfBirth);

  if (ageInMonths < 6 || ageInMonths >= 60) return null;

  if (ageInMonths >= 6 && ageInMonths < 12) return AgeGroup.MONTHS_6_12;
  if (ageInMonths >= 12 && ageInMonths < 18) return AgeGroup.MONTHS_12_18;
  if (ageInMonths >= 18 && ageInMonths < 24) return AgeGroup.MONTHS_18_24;
  if (ageInMonths >= 24 && ageInMonths < 36) return AgeGroup.MONTHS_24_36;
  if (ageInMonths >= 36 && ageInMonths < 60) return AgeGroup.YEARS_3_5;

  return null;
}