import { VehiclePricing, PricingBreakdown } from '../types';
import { formatDuration } from './utils';

/**
 * Deterministic pricing calculator used across frontend and backend.
 * Calculates exact base rental, security deposit, 18% GST tax, and total payable.
 */
export function calculateRentalPrice(
  pricing: VehiclePricing,
  durationHours: number
): PricingBreakdown {
  const hours = Math.max(1, durationHours);
  const taxRate = (pricing.tax_rate_percent || 18) / 100;
  const deposit = Number(pricing.security_deposit || 0);

  let baseRental = 0;
  let rateDescription = '';

  if (hours <= 1) {
    baseRental = Number(pricing.hourly_rate);
    rateDescription = `1 Hour Rental @ ₹${pricing.hourly_rate}/hr`;
  } else if (hours < 6) {
    // Check if hourly is less than 6-hour package
    const hourlyCost = hours * Number(pricing.hourly_rate);
    if (hourlyCost < Number(pricing.six_hour_rate)) {
      baseRental = hourlyCost;
      rateDescription = `${hours} Hours @ ₹${pricing.hourly_rate}/hr`;
    } else {
      baseRental = Number(pricing.six_hour_rate);
      rateDescription = `6-Hour Flat Package`;
    }
  } else if (hours <= 8) {
    // 6 to 8 hours: flat 6-hour rate or incremental hourly
    const extraHours = hours - 6;
    const extraCost = extraHours * Number(pricing.hourly_rate);
    const total = Number(pricing.six_hour_rate) + extraCost;
    if (total < Number(pricing.daily_rate)) {
      baseRental = total;
      rateDescription = `6-Hour Pack + ${extraHours} hr extra`;
    } else {
      baseRental = Number(pricing.daily_rate);
      rateDescription = `Full Day Special (Capped)`;
    }
  } else if (hours <= 24) {
    baseRental = Number(pricing.daily_rate);
    rateDescription = `1 Full Day (24 Hours)`;
  } else {
    // Multi-day pricing
    const days = Math.ceil(hours / 24);
    
    if (days >= 7) {
      const weeks = Math.floor(days / 7);
      const remDays = days % 7;
      baseRental = (weeks * Number(pricing.weekly_rate)) + (remDays * Number(pricing.daily_rate) * 0.85);
      rateDescription = remDays > 0 
        ? `${weeks} Week${weeks > 1 ? 's' : ''} + ${remDays} Days (Weekly Saver)`
        : `${weeks} Week${weeks > 1 ? 's' : ''} (Weekly Saver)`;
    } else if (days === 2) {
      // 2 Days special discount (typically ~12.5% off standard 2 days)
      baseRental = Math.round(Number(pricing.daily_rate) * 1.75);
      rateDescription = `2 Days Weekend Special`;
    } else {
      // 3-6 days: 10% multi-day discount
      baseRental = Math.round(days * Number(pricing.daily_rate) * 0.9);
      rateDescription = `${days} Days Rental (10% Multi-day Saver)`;
    }
  }

  // Ensure base rental is rounded to whole numbers
  baseRental = Math.round(baseRental);
  const taxAmount = Math.round(baseRental * taxRate);
  const totalPayable = baseRental + deposit + taxAmount;

  return {
    durationHours: hours,
    durationFormatted: formatDuration(hours),
    baseRental,
    securityDeposit: deposit,
    taxAmount,
    discountAmount: 0,
    totalPayable,
    rateAppliedDescription: rateDescription,
  };
}
