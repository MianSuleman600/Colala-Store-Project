// utils/progress.js

// Required fields per level & step
export const REQUIRED_FIELDS = {
  1: {
    step1: ['storeName', 'storeLocation', 'email', 'phoneNumber', 'password', 'referralCode'],
    step2: ['profilePicture', 'storeBanner'],
    step3: ['categories', 'whatsapp', 'instagram', 'facebook', 'twitter'],
  },
  2: {
    step1: ['businessName', 'businessType', 'ninNumber', 'cacNumber'],
    step2: ['ninSlip', 'cacCertificate'],
  },
  3: {
    step1: ['hasPhysicalStore', 'storeVideo'],
    step2: ['storeAddress'],
    step3: ['deliveryPricing'],
    step4: ['utilityBill'],
    step5: ['selectedColor'],
  },
};

/**
 * Compute progress per level and overall completion
 */
export const computeProgressBreakdown = (formData, requiredFields = REQUIRED_FIELDS) => {
  const byLevel = {};
  let totalFields = 0;
  let totalCompleted = 0;

  for (let level = 1; level <= 3; level++) {
    const levelKey = `level${level}`;
    const steps = formData[levelKey] || {};
    let levelTotal = 0;
    let levelCompleted = 0;

    for (const stepKey in steps) {
      const stepData = steps[stepKey];
      const required = requiredFields[level]?.[stepKey] || [];

      levelTotal += required.length;

      required.forEach((field) => {
        const value = stepData[field];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            if (value.length > 0) levelCompleted += 1;
          } else if (typeof value === 'string') {
            if (value.trim() !== '') levelCompleted += 1;
          } else if (typeof value === 'boolean') {
            // Count booleans only if true
            if (value) levelCompleted += 1;
          } else {
            levelCompleted += 1;
          }
        }
      });
    }

    const percentage = levelTotal > 0 ? Math.min(Math.round((levelCompleted / levelTotal) * 100), 100) : 0;
    byLevel[level] = { total: levelTotal, completed: levelCompleted, percentage };

    totalFields += levelTotal;
    totalCompleted += levelCompleted;
  }

  const overallPercentage = totalFields > 0 ? Math.min(Math.round((totalCompleted / totalFields) * 100), 100) : 0;

  return { byLevel, overallPercentage };
};
