// Vercel Serverless Function to send contact emails via Resend
// Reads configuration from environment variables:
// - RESEND_API_KEY (required)
// - CONTACT_TO_EMAIL (required)
// - CONTACT_FROM_EMAIL (required, should be a verified domain/sender in Resend)
// - RECAPTCHA_SECRET_KEY (optional; if present, verifies Google reCAPTCHA)

const { Resend } = require('resend');
const querystring = require('querystring');

const resendApiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.CONTACT_TO_EMAIL;
const fromEmail = process.env.CONTACT_FROM_EMAIL;
const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;

async function parseRequestBody(req) {
  return new Promise((resolve) => {
    // If a body parser has already populated req.body (common in Vercel Node runtime), use it
    if (req.body && Object.keys(req.body).length > 0) {
      return resolve(req.body);
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const contentType = (req.headers['content-type'] || '').split(';')[0];
      try {
        if (contentType === 'application/json') {
          return resolve(JSON.parse(body || '{}'));
        }
        if (contentType === 'application/x-www-form-urlencoded') {
          return resolve(querystring.parse(body));
        }
      } catch (_) {
        // fallthrough
      }
      // Fallback: try URLSearchParams
      try {
        const params = new URLSearchParams(body);
        const result = {};
        for (const [key, value] of params.entries()) result[key] = value;
        return resolve(result);
      } catch (_) {
        return resolve({});
      }
    });
  });
}

async function verifyRecaptcha(token, remoteIp) {
  if (!recaptchaSecret) return { ok: true };
  try {
    const params = new URLSearchParams({
      secret: recaptchaSecret,
      response: token,
    });
    if (remoteIp) params.set('remoteip', remoteIp);

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const data = await response.json();
    return { ok: !!data.success, data };
  } catch (error) {
    return { ok: false, error };
  }
}

function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input.toString().trim();
}

module.exports = async (req, res) => {
  const okMessage = 'Contact form successfully submitted. Thank you, I will get back to you soon!';
  const errorMessage = 'There was an error while submitting the form. Please try again later';

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ type: 'danger', message: 'Method Not Allowed' });
  }

  if (!resendApiKey || !toEmail || !fromEmail) {
    return res.status(200).json({ type: 'danger', message: 'Email service not configured. Please set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.' });
  }

  const body = await parseRequestBody(req);

  const name = sanitize(body.name);
  const email = sanitize(body.email);
  const subject = sanitize(body.subject) || `You Have Received a Message From ${name}.`;
  const message = sanitize(body.message);
  const token = sanitize(body['g-recaptcha-response'] || body.token || body.gtoken || body['g-token']);

  if (!email || !name || !message) {
    return res.status(200).json({ type: 'danger', message: 'Please provide name, email, and message.' });
  }

  // Optional reCAPTCHA verification
  const remoteIp = (req.headers['x-forwarded-for'] || '').split(',')[0]?.trim();
  const recaptchaResult = await verifyRecaptcha(token, remoteIp);
  if (!recaptchaResult.ok) {
    return res.status(200).json({ type: 'danger', message: 'reCAPTCHA verification failed.' });
  }

  const resend = new Resend(resendApiKey);

  const html = `
    <div>
      <p>You have received a message from: <strong>${name}</strong></p>
      <p>${message.replace(/\n/g, '<br/>')}</p>
      <p>You can contact ${name} via email, <a href="mailto:${email}">${email}</a>.</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: subject,
      html: html,
      reply_to: email,
    });

    if (error) {
      return res.status(200).json({ type: 'danger', message: errorMessage });
    }

    return res.status(200).json({ type: 'success', message: okMessage });
  } catch (err) {
    return res.status(200).json({ type: 'danger', message: errorMessage });
  }
};


