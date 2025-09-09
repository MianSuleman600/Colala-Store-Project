// src/utils/progress.js

// Central place for completion rules and fields.
// Import this in the slice and in UI that needs per-level progress.

export const NESTED_FIELDS = {
  storeAddress: ['state', 'localGovernment', 'fullAddress'],
};

export const REQUIRED_FIELDS = {
  'level1.step1': ['storeName', 'storeLocation', 'email', 'phoneNumber', 'password'],
  'level1.step2': ['profilePicture', 'storeBanner'],
  'level1.step3': ['location'],
  'level2.step1': ['businessName', 'businessType', 'ninNumber', 'cacNumber'],
  'level2.step2': ['ninSlip', 'cacCertificate'],
  'level3.step1': ['hasPhysicalStore'], // storeVideo required only if true (handled below)
  'level3.step2': ['deliveryPricing', 'selectedColor', 'storeAddress'],
};

export function isFieldComplete(field, val) {
  if (!val) return false;

  if (Array.isArray(val)) return val.length > 0;

  // Defensive check for File
  if (typeof File !== 'undefined' && val instanceof File) return true;

  if (typeof val === 'object') {
    const subs = NESTED_FIELDS[field];
    if (subs) {
      return subs.every((s) => val && val[s]);
    }
    // Any non-null object (including file metadata) counts
    return true;
  }

  // For primitives, if non-falsy we already returned true
  return true;
}

export function computeProgressBreakdown(formData, REQUIRED) {
  const byLevel = {
    1: { completed: 0, total: 0, percentage: 0 },
    2: { completed: 0, total: 0, percentage: 0 },
    3: { completed: 0, total: 0, percentage: 0 },
  };

  Object.entries(REQUIRED).forEach(([path, fields]) => {
    const [levelKey, stepKey] = path.split('.');
    const levelNum = Number(levelKey.replace('level', ''));

    fields.forEach((field) => {
      byLevel[levelNum].total += 1;
      const val = formData?.[levelKey]?.[stepKey]?.[field];
      if (isFieldComplete(field, val)) byLevel[levelNum].completed += 1;
    });
  });

  // Conditional requirement: storeVideo if hasPhysicalStore === true
  const hasPhysical = formData?.level3?.step1?.hasPhysicalStore === true;
  if (hasPhysical) {
    byLevel[3].total += 1;
    const v = formData?.level3?.step1?.storeVideo;
    if (isFieldComplete('storeVideo', v)) byLevel[3].completed += 1;
  }

  let overallCompleted = 0;
  let overallTotal = 0;

  [1, 2, 3].forEach((lvl) => {
    const { completed, total } = byLevel[lvl];
    overallCompleted += completed;
    overallTotal += total;
    byLevel[lvl].percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  });

  const overallPercentage = overallTotal === 0 ? 0 : Math.round((overallCompleted / overallTotal) * 100);

  return { overallPercentage, byLevel };
}