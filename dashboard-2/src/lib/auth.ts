/**
 * List of authorized email addresses that have access to prescriptions and vitals
 * Add more email addresses to this array to grant access
 */
export const AUTHORIZED_EMAILS = [
  'mohitmongia2005@gmail.com',
  // Add more authorized email addresses here:
  // 'another-email@gmail.com',
  // 'yet-another-email@gmail.com',
  'mohitmongia04@gmail.com',
  'gulatisparsh0212@gmail.com',
  'vasuvarshney26@gmail.com',
  'abdullah26176@gmail.com'
];

/**
 * Check if a user's email is authorized to access restricted features
 * @param email - The user's email address
 * @returns true if the email is in the authorized list, false otherwise
 */
export const isAuthorizedEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return AUTHORIZED_EMAILS.includes(email);
};

