import { VALIDATION_RULES } from './constants';

export const validators = {
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!VALIDATION_RULES.EMAIL_REGEX.test(value)) {
      return 'Please enter a valid email address';
    }
    return true;
  },

  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`;
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(value)) {
      return 'Password must contain at least one number';
    }
    return true;
  },

  confirmPassword: (value: string, password: string) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return true;
  },

  name: (value: string) => {
    if (!value) return 'Name is required';
    if (value.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      return `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters long`;
    }
    if (value.length > VALIDATION_RULES.NAME_MAX_LENGTH) {
      return `Name must be no more than ${VALIDATION_RULES.NAME_MAX_LENGTH} characters long`;
    }
    return true;
  },

  phone: (value: string) => {
    if (!value) return 'Phone number is required';
    const cleanPhone = value.replace(/\s/g, '');
    if (!VALIDATION_RULES.PHONE_REGEX.test(cleanPhone)) {
      return 'Please enter a valid phone number';
    }
    return true;
  },

  required: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return true;
  },

  minLength: (min: number) => (value: string) => {
    if (!value) return 'This field is required';
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return true;
  },

  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return true;
  },

  address: (value: string) => {
    if (!value) return 'Address is required';
    if (value.length > VALIDATION_RULES.ADDRESS_MAX_LENGTH) {
      return `Address must be no more than ${VALIDATION_RULES.ADDRESS_MAX_LENGTH} characters long`;
    }
    return true;
  },

  city: (value: string) => {
    if (!value) return 'City is required';
    if (value.length > VALIDATION_RULES.CITY_MAX_LENGTH) {
      return `City must be no more than ${VALIDATION_RULES.CITY_MAX_LENGTH} characters long`;
    }
    return true;
  },

  zipCode: (value: string) => {
    if (!value) return 'ZIP code is required';
    if (!VALIDATION_RULES.ZIP_CODE_REGEX.test(value)) {
      return 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
    }
    return true;
  },

  cardNumber: (value: string) => {
    if (!value) return 'Card number is required';
    if (!VALIDATION_RULES.CARD_NUMBER_REGEX.test(value)) {
      return 'Please enter a valid card number';
    }
    return true;
  },

  cvv: (value: string) => {
    if (!value) return 'CVV is required';
    if (!VALIDATION_RULES.CVV_REGEX.test(value)) {
      return 'Please enter a valid CVV';
    }
    return true;
  },

  expiryDate: (value: string) => {
    if (!value) return 'Expiry date is required';
    if (!VALIDATION_RULES.EXPIRY_DATE_REGEX.test(value)) {
      return 'Please enter a valid expiry date (MM/YY)';
    }
    
    const [month, year] = value.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    if (expiryDate < now) {
      return 'Card has expired';
    }
    
    return true;
  },

  quantity: (value: number, maxStock?: number) => {
    if (!value || value < 1) return 'Quantity must be at least 1';
    if (maxStock && value > maxStock) {
      return `Only ${maxStock} items available`;
    }
    return true;
  },

  rating: (value: number) => {
    if (!value) return 'Rating is required';
    if (value < 1 || value > 5) {
      return 'Rating must be between 1 and 5';
    }
    return true;
  },

  review: (value: string) => {
    if (!value) return 'Review is required';
    if (value.length < VALIDATION_RULES.MIN_REVIEW_LENGTH) {
      return `Review must be at least ${VALIDATION_RULES.MIN_REVIEW_LENGTH} characters long`;
    }
    if (value.length > VALIDATION_RULES.MAX_REVIEW_LENGTH) {
      return `Review must be no more than ${VALIDATION_RULES.MAX_REVIEW_LENGTH} characters long`;
    }
    return true;
  },
};

export default validators;
