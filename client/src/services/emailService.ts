import { emailConfig, emailjs } from '@/config/emailConfig';

async function sendContactEmail(formData: FormData, blockedEmails: string[] = []) {
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        formData as any,
      );
      return { success: true, result };
    } catch (error) {
      console.error('EmailJS Error:', error);
      return { success: false, error };
    }
}

export default sendContactEmail;
  