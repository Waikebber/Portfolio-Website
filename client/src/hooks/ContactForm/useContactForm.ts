import { useRef, useState } from 'react';
import sendContactEmail from '@/services/emailService';
import useGetBlockedEmails from '@/hooks/ContactForm/useGetBlockedEmails';

export default function useContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const blockedEmails = useGetBlockedEmails();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!formRef.current) return;

    const form = formRef.current;
    const formData = new FormData(form);

    // Client-side message validation
    const message = formData.get('message')?.toString().trim() || '';
    if (message.length < 10) {
      setIsInvalid(true);
      setErrorMsg('Message must be at least 10 characters long.');
      return;
    }

    // Check blocked emails
    const userEmail = formData.get('email')?.toString().trim() || '';
    if (blockedEmails.includes(userEmail)) {
      setIsInvalid(true);
      setErrorMsg('This email address has been blocked from submission.');
      return;
    }

    const result = await sendContactEmail(form, blockedEmails);
    if (result.success) {
      setIsInvalid(false);
      setSuccessMsg("Thanks for reaching out. I'll get back to you soon.");
      form.reset();
    } else {
      setIsInvalid(true);
      setErrorMsg('Something went wrong. Please try again later.');
    }
};

  return {
    formRef,
    handleSubmit,
    isInvalid,
    errorMsg,
    successMsg,
  };
}
