// Validation functions for form inputs

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name must be less than 50 characters' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods' };
  }
  
  return { isValid: true };
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  
  // Comprehensive email regex pattern
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  // Check for common email issues
  if (email.includes('..') || email.includes('--') || email.includes('__')) {
    return { isValid: false, error: 'Email contains invalid consecutive characters' };
  }
  
  if (email.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }
  
  return { isValid: true };
};

export const validateIndianPhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Indian phone number patterns:
  // Mobile: 6, 7, 8, 9 followed by 9 digits (total 10 digits)
  // Landline: 2, 3, 4, 5, 6, 7, 8 followed by 9 digits (total 10 digits)
  // With country code: +91 followed by 10 digits (total 13 characters)
  
  if (cleanPhone.length === 10) {
    // 10-digit number
    const firstDigit = parseInt(cleanPhone[0]);
    
    // Mobile numbers start with 6, 7, 8, 9
    if ([6, 7, 8, 9].includes(firstDigit)) {
      return { isValid: true };
    }
    
    // Landline numbers start with 2, 3, 4, 5, 6, 7, 8
    if ([2, 3, 4, 5, 6, 7, 8].includes(firstDigit)) {
      return { isValid: true };
    }
    
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    // 12-digit number with country code (91)
    const numberWithoutCode = cleanPhone.substring(2);
    const firstDigit = parseInt(numberWithoutCode[0]);
    
    if ([6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8].includes(firstDigit)) {
      return { isValid: true };
    }
    
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  if (cleanPhone.length === 13 && cleanPhone.startsWith('91')) {
    // 13-digit number with country code (91)
    const numberWithoutCode = cleanPhone.substring(2);
    const firstDigit = parseInt(numberWithoutCode[0]);
    
    if ([6, 7, 8, 9, 2, 3, 4, 5, 6, 7, 8].includes(firstDigit)) {
      return { isValid: true };
    }
    
    return { isValid: false, error: 'Invalid phone number format' };
  }
  
  return { isValid: false, error: 'Phone number must be 10 digits (or 12/13 with country code +91)' };
};

export const formatIndianPhone = (phone: string): string => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    // Format as: 98765 43210
    return `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    // Format as: +91 98765 43210
    const numberWithoutCode = cleanPhone.substring(2);
    return `+91 ${numberWithoutCode.slice(0, 5)} ${numberWithoutCode.slice(5)}`;
  }
  
  if (cleanPhone.length === 13 && cleanPhone.startsWith('91')) {
    // Format as: +91 98765 43210
    const numberWithoutCode = cleanPhone.substring(2);
    return `+91 ${numberWithoutCode.slice(0, 5)} ${numberWithoutCode.slice(5)}`;
  }
  
  return phone; // Return original if can't format
}; 