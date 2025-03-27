import emailjs from '@emailjs/browser';

const emailConfig = {
    serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
    templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
    publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
};

emailjs.init({
  publicKey: emailConfig.publicKey,
  blockHeadless: true,
  blockList: {
    list: [],
    watchVariable: 'email',
  },
  limitRate: {
    id: 'kai-site',
    throttle: 1000, // 1 request per second (minimum)
  },
});

export { emailConfig, emailjs };
  