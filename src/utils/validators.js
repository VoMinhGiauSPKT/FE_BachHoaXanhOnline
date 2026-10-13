/**
 * Các biểu thức Regex và quy tắc kiểm tra định dạng dữ liệu (Validators)
 */

export const VIETNAM_PHONE_REGEX = /^(0[35789])[0-9]{8}$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Quy tắc kiểm tra số điện thoại Việt Nam chuẩn
 * @param {boolean} required
 * @param {string} [requiredMessage]
 */
export const getPhoneRules = (required = true, requiredMessage = 'Vui lòng nhập số điện thoại') => {
  const rules = [];
  if (required) {
    rules.push({ required: true, message: requiredMessage });
  }
  rules.push({
    pattern: VIETNAM_PHONE_REGEX,
    message: 'Số điện thoại không đúng định dạng (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09)'
  });
  return rules;
};

/**
 * Quy tắc kiểm tra email / gmail
 * @param {boolean} required
 * @param {string} [requiredMessage]
 */
export const getEmailRules = (required = false, requiredMessage = 'Vui lòng nhập email/gmail') => {
  const rules = [];
  if (required) {
    rules.push({ required: true, message: requiredMessage });
  }
  rules.push({
    pattern: EMAIL_REGEX,
    message: 'Email/Gmail không đúng định dạng (ví dụ: example@gmail.com)'
  });
  return rules;
};
