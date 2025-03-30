import { emailConfig, emailjs } from '@/config/emailConfig';

async function sendContactEmail(form: HTMLFormElement, blockedEmails: string[] = []) {
  const formData = new FormData(form);
  const userEmail = formData.get('email')?.toString().trim() || '';

  if (blockedEmails.includes(userEmail)) {
    return {
      success: false,
      error: new Error('Blocked email address.'),
    };
  }

  try {
    const result = await emailjs.sendForm(
      emailConfig.serviceId,
      emailConfig.templateId,
      form
    );
    return { success: true, result };
  } catch (error) {
    console.error('EmailJS Error:', error);
    return { success: false, error };
  }
}

export default sendContactEmail;
  