import { AgeGroup } from '@/config/ageGroups';

export const QUESTIONNAIRE_6_12_MONTHS = {
  ageGroup: AgeGroup.MONTHS_6_12,
  name: 'Early Development Screening (6-12 Months)',
  sections: [
    {
      id: 'early_social',
      title: 'Early Social Development',
      questions: [
        { id: 'q1', text: 'Does your baby smile at you or other familiar people?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q2', text: 'Does your baby make eye contact when you talk or play with them?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q3', text: 'Does your baby respond to their name by turning to look at you?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.12, isCritical: false },
      ],
    },
    {
      id: 'early_communication',
      title: 'Early Communication',
      questions: [
        { id: 'q4', text: 'Does your baby babble or make cooing sounds?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
        { id: 'q5', text: 'Does your baby react to sounds (turn toward voices or music)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.12, isCritical: true },
      ],
    },
    {
      id: 'early_behavior',
      title: 'Behavior and Play',
      questions: [
        { id: 'q6', text: 'Does your baby show interest in toys or objects?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
        { id: 'q7', text: 'Does your baby have any repetitive movements (like hand flapping or rocking)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 2 }, { value: 'no', label: 'No', points: 0 }], weight: 0.12, isCritical: false },
      ],
    },
  ],
  maxPossibleScore: 12,
  riskThresholds: { low: 2, medium: 6, high: 12 },
  criticalItemsThreshold: 2,
};

export const QUESTIONNAIRE_12_18_MONTHS = {
  ageGroup: AgeGroup.MONTHS_12_18,
  name: 'Toddler Development Screening (12-18 Months)',
  sections: [
    {
      id: 'social_interaction',
      title: 'Social Interaction',
      questions: [
        { id: 'q1', text: 'Does your child look at you when you call their name?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q2', text: 'Does your child smile or laugh when you play with them?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.12, isCritical: false },
        { id: 'q3', text: 'Does your child show you things by holding them up or bringing them to you?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
      ],
    },
    {
      id: 'communication',
      title: 'Communication Skills',
      questions: [
        { id: 'q4', text: 'Does your child try to copy what you do (like clapping, waving)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
        { id: 'q5', text: 'Does your child point at things to show interest?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q6', text: 'Does your child understand simple words like "no" or "bye-bye"?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
      ],
    },
    {
      id: 'play_behavior',
      title: 'Play and Behavior',
      questions: [
        { id: 'q7', text: 'Does your child play with a variety of toys in different ways?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
        { id: 'q8', text: 'Does your child have repetitive behaviors or get very upset with changes in routine?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 2 }, { value: 'no', label: 'No', points: 0 }], weight: 0.12, isCritical: false },
      ],
    },
  ],
  maxPossibleScore: 14,
  riskThresholds: { low: 3, medium: 7, high: 14 },
  criticalItemsThreshold: 2,
};

export const QUESTIONNAIRE_18_24_MONTHS = {
  ageGroup: AgeGroup.MONTHS_18_24,
  name: 'Modified Checklist for Autism in Toddlers (M-CHAT-R Inspired)',
  sections: [
    {
      id: 'social_interaction',
      title: 'Social Interaction',
      questions: [
        { id: 'q1', text: 'If you point at something across the room, does your child look at it?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q2', text: 'Does your child ever use their index finger to point, to ask for something?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q3', text: 'Does your child ever use their index finger to point, to indicate interest in something?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q4', text: 'Does your child look at you when you call their name?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.12, isCritical: false },
        { id: 'q5', text: 'Does your child smile in response to your face or your smile?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
      ],
    },
    {
      id: 'communication',
      title: 'Communication',
      questions: [
        { id: 'q6', text: 'Does your child show you things (bring or hold up objects to show you)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.12, isCritical: true },
        { id: 'q7', text: 'Does your child respond when you call their name?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.12, isCritical: true },
      ],
    },
    {
      id: 'play_behavior',
      title: 'Play and Behavior',
      questions: [
        { id: 'q8', text: 'Does your child play pretend or make-believe (e.g., pretend to drink from an empty cup)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
        { id: 'q9', text: 'Does your child have any unusual or repetitive movements or mannerisms?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 2 }, { value: 'no', label: 'No', points: 0 }], weight: 0.12, isCritical: false },
      ],
    },
  ],
  maxPossibleScore: 15,
  riskThresholds: { low: 3, medium: 8, high: 15 },
  criticalItemsThreshold: 2,
};

export const QUESTIONNAIRE_24_36_MONTHS = {
  ageGroup: AgeGroup.MONTHS_24_36,
  name: 'Early Childhood Development Screening (24-36 Months)',
  sections: [
    {
      id: 'social_skills',
      title: 'Social Skills',
      questions: [
        { id: 'q1', text: 'Does your child play with other children or show interest in playing with them?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q2', text: 'Does your child make eye contact when talking or playing?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q3', text: 'Does your child copy you or other adults (like household chores or activities)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.12, isCritical: false },
        { id: 'q4', text: 'Does your child comfort others when they are sad or hurt?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
      ],
    },
    {
      id: 'language_communication',
      title: 'Language and Communication',
      questions: [
        { id: 'q5', text: 'Does your child use 2-3 word phrases to communicate?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q6', text: 'Does your child follow simple instructions (like "put the toy on the table")?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.12, isCritical: false },
        { id: 'q7', text: 'Does your child point to pictures in books when you name them?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
      ],
    },
    {
      id: 'play_imagination',
      title: 'Play and Imagination',
      questions: [
        { id: 'q8', text: 'Does your child engage in pretend play (like feeding a doll, talking on toy phone)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
        { id: 'q9', text: 'Does your child insist on sameness or get very upset with small changes in routine?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 2 }, { value: 'no', label: 'No', points: 0 }], weight: 0.12, isCritical: false },
        { id: 'q10', text: 'Does your child have intense, narrow interests or repetitive behaviors?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 2 }, { value: 'no', label: 'No', points: 0 }], weight: 0.12, isCritical: false },
      ],
    },
  ],
  maxPossibleScore: 16,
  riskThresholds: { low: 3, medium: 8, high: 16 },
  criticalItemsThreshold: 2,
};

export const QUESTIONNAIRE_3_5_YEARS = {
  ageGroup: AgeGroup.YEARS_3_5,
  name: 'Preschool Development Screening (3-5 Years)',
  sections: [
    {
      id: 'social_emotional',
      title: 'Social and Emotional Development',
      questions: [
        { id: 'q1', text: 'Does your child play cooperatively with other children (taking turns, sharing)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q2', text: 'Does your child show a wide range of emotions appropriately?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.12, isCritical: false },
        { id: 'q3', text: "Does your child understand and show concern for others' feelings?", type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q4', text: 'Does your child make friends easily?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
      ],
    },
    {
      id: 'communication_language',
      title: 'Communication and Language',
      questions: [
        { id: 'q5', text: 'Does your child speak in full sentences (4-5 words)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q6', text: 'Can your child have a simple conversation (back and forth exchange)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 2 }], weight: 0.15, isCritical: true },
        { id: 'q7', text: 'Does your child understand and follow 2-3 step instructions?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.12, isCritical: false },
      ],
    },
    {
      id: 'behavior_interests',
      title: 'Behavior and Interests',
      questions: [
        { id: 'q8', text: 'Does your child engage in imaginative, creative play with varied themes?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 0 }, { value: 'no', label: 'No', points: 1 }], weight: 0.1, isCritical: false },
        { id: 'q9', text: 'Does your child have very restricted interests or insist on routines?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 2 }, { value: 'no', label: 'No', points: 0 }], weight: 0.12, isCritical: false },
        { id: 'q10', text: 'Does your child have repetitive movements, speech, or behaviors?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 2 }, { value: 'no', label: 'No', points: 0 }], weight: 0.12, isCritical: false },
        { id: 'q11', text: 'Does your child have unusual sensory reactions (oversensitive or undersensitive to sounds, textures, etc.)?', type: 'yes_no', options: [{ value: 'yes', label: 'Yes', points: 1 }, { value: 'no', label: 'No', points: 0 }], weight: 0.1, isCritical: false },
      ],
    },
  ],
  maxPossibleScore: 18,
  riskThresholds: { low: 3, medium: 9, high: 18 },
  criticalItemsThreshold: 2,
};

export function getQuestionnaireByAge(ageGroup) {
  switch (ageGroup) {
    case AgeGroup.MONTHS_6_12: return QUESTIONNAIRE_6_12_MONTHS;
    case AgeGroup.MONTHS_12_18: return QUESTIONNAIRE_12_18_MONTHS;
    case AgeGroup.MONTHS_18_24: return QUESTIONNAIRE_18_24_MONTHS;
    case AgeGroup.MONTHS_24_36: return QUESTIONNAIRE_24_36_MONTHS;
    case AgeGroup.YEARS_3_5: return QUESTIONNAIRE_3_5_YEARS;
    default: return QUESTIONNAIRE_18_24_MONTHS;
  }
}