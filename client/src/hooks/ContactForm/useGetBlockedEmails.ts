import { useEffect, useState } from 'react';

export default function useGetBlockedEmails(): string[] {
  const [emails, setEmails] = useState<string[]>([]);

  useEffect(() => {
    fetch('/data/blocked-emails.csv')
      .then((res) => res.text())
      .then((text) => {
        const parsed = text
          .split('\n')
          .map(line => line.trim())
          .filter(email => email.length > 0);
        setEmails(parsed);
      })
      .catch((err) => {
        console.error('Failed to load blocked emails:', err);
        setEmails([]);
      });
  }, []);

  return emails;
}