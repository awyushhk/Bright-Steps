// Combines questionnaire score + Gemini video indicators into final risk

// Weights
const QUESTIONNAIRE_WEIGHT = 0.6;
const VIDEO_WEIGHT = 0.4;

// Behavioral indicators Gemini will return scores for (0-10, 10 = most typical)
// We invert them so higher = more concern
export const BEHAVIORAL_INDICATORS = [
  'eye_contact',
  'response_to_name',
  'social_engagement',
  'repetitive_movements',
  'pointing_gesturing',
];

/**
 * Normalize questionnaire score to 0-100 concern scale
 * Higher = more concern
 */
function normalizeQuestionnaireScore(score, maxScore = 15) {
  return (score / maxScore) * 100;
}

/**
 * Convert Gemini indicator scores (0-10 typical) to concern score (0-100)
 * eye_contact: 9/10 typical → 10% concern
 * repetitive_movements: 2/10 typical → 80% concern
 */
function normalizeVideoScore(indicators) {
  if (!indicators || Object.keys(indicators).length === 0) return null;

  const scores = Object.values(indicators);
  const avgTypical = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  // Invert: low typical score = high concern
  return ((10 - avgTypical) / 10) * 100;
}

/**
 * Determine risk level from combined concern score (0-100)
 */
function getCombinedRiskLevel(combinedScore) {
  if (combinedScore >= 60) return 'high';
  if (combinedScore >= 35) return 'medium';
  return 'low';
}

/**
 * Generate human-readable explanation of the risk
 */
function generateExplanation(questionnaireScore, videoIndicators, riskLevel, maxScore = 15) {
  const lines = [];

  // Questionnaire part
  const qNorm = normalizeQuestionnaireScore(questionnaireScore, maxScore);
  if (qNorm >= 60) {
    lines.push(`Questionnaire responses indicated significant areas of concern (score: ${questionnaireScore}/${maxScore}).`);
  } else if (qNorm >= 35) {
    lines.push(`Questionnaire responses showed some areas to monitor (score: ${questionnaireScore}/${maxScore}).`);
  } else {
    lines.push(`Questionnaire responses were mostly typical (score: ${questionnaireScore}/${maxScore}).`);
  }

  // Video part
  if (videoIndicators) {
    const concerns = [];
    const strengths = [];

    if (videoIndicators.eye_contact !== undefined) {
      if (videoIndicators.eye_contact <= 4) concerns.push('limited eye contact');
      else if (videoIndicators.eye_contact >= 7) strengths.push('good eye contact');
    }
    if (videoIndicators.response_to_name !== undefined) {
      if (videoIndicators.response_to_name <= 4) concerns.push('limited response to name');
      else if (videoIndicators.response_to_name >= 7) strengths.push('responsive to name');
    }
    if (videoIndicators.social_engagement !== undefined) {
      if (videoIndicators.social_engagement <= 4) concerns.push('reduced social engagement');
      else if (videoIndicators.social_engagement >= 7) strengths.push('good social engagement');
    }
    if (videoIndicators.repetitive_movements !== undefined) {
      // For repetitive movements, LOW typical score = HIGH concern
      if (videoIndicators.repetitive_movements <= 4) concerns.push('presence of repetitive movements');
    }
    if (videoIndicators.pointing_gesturing !== undefined) {
      if (videoIndicators.pointing_gesturing <= 4) concerns.push('limited pointing or gesturing');
      else if (videoIndicators.pointing_gesturing >= 7) strengths.push('uses pointing and gestures');
    }

    if (concerns.length > 0) {
      lines.push(`Video analysis detected: ${concerns.join(', ')}.`);
    }
    if (strengths.length > 0) {
      lines.push(`Positive indicators observed: ${strengths.join(', ')}.`);
    }
  } else {
    lines.push('No video was provided for analysis.');
  }

  // Final summary
  switch (riskLevel) {
    case 'high':
      lines.push('Combined assessment suggests further professional evaluation is recommended.');
      break;
    case 'medium':
      lines.push('Combined assessment suggests continued monitoring and discussion with your pediatrician.');
      break;
    case 'low':
      lines.push('Combined assessment suggests typical developmental patterns.');
      break;
  }

  return lines.join(' ');
}

/**
 * Main function: combine questionnaire + video into final risk assessment
 */
export function computeFinalRisk({
  questionnaireScore,
  maxQuestionnaireScore = 15,
  videoIndicators = null,
  existingRiskLevel,
  recommendations,
}) {
  const qConcern = normalizeQuestionnaireScore(questionnaireScore, maxQuestionnaireScore);
  const vConcern = normalizeVideoScore(videoIndicators);

  let combinedScore;
  let breakdown;

  if (vConcern !== null) {
    // Both questionnaire and video available
    combinedScore = qConcern * QUESTIONNAIRE_WEIGHT + vConcern * VIDEO_WEIGHT;
    breakdown = {
      questionnaireConcern: Math.round(qConcern),
      videoConcern: Math.round(vConcern),
      questionnaireWeight: QUESTIONNAIRE_WEIGHT,
      videoWeight: VIDEO_WEIGHT,
      combinedScore: Math.round(combinedScore),
    };
  } else {
    // Only questionnaire
    combinedScore = qConcern;
    breakdown = {
      questionnaireConcern: Math.round(qConcern),
      videoConcern: null,
      questionnaireWeight: 1.0,
      videoWeight: 0,
      combinedScore: Math.round(combinedScore),
    };
  }

  const riskLevel = getCombinedRiskLevel(combinedScore);
  const explanation = generateExplanation(
    questionnaireScore,
    videoIndicators,
    riskLevel,
    maxQuestionnaireScore
  );

  return {
    level: riskLevel,
    score: questionnaireScore,
    combinedScore: Math.round(combinedScore),
    videoIndicators: videoIndicators || null,
    explanation,
    breakdown,
    recommendations: recommendations || getDefaultRecommendations(riskLevel),
    generatedAt: new Date().toISOString(),
  };
}

function getDefaultRecommendations(riskLevel) {
  switch (riskLevel) {
    case 'low':
      return [
        'Your child is showing typical developmental patterns',
        'Continue regular developmental monitoring',
        'You can repeat this screening in 3-6 months if desired',
      ];
    case 'medium':
      return [
        'Some responses indicate areas to monitor',
        'Discuss these results with your pediatrician',
        'Consider repeating this screening in 1-2 months',
        'Early intervention can be beneficial',
      ];
    case 'high':
      return [
        'Multiple indicators suggest need for further evaluation',
        'Schedule an appointment with your pediatrician soon',
        'Request a referral to a developmental specialist',
        'Early intervention services can begin before formal diagnosis',
      ];
  }
}