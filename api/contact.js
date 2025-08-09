// Vercel Serverless Function for handling contact form submissions with Resend
const { Resend } = require('resend');

module.exports = async function handler(req, res) {
  const okMessage = 'Contact form successfully submitted. Thank you, I will get back to you soon!';
  const errorMessage = 'There was an error while submitting the form. Please try again later';

  if (req.method !== 'POST') {
    res.status(405).json({ type: 'danger', message: 'Method not allowed' });
    return;
  }

  try {
    const contentType = (req.headers['content-type'] || '').toLowerCase();
    const rawBody = await readRequestBody(req);

    let payload = {};

    if (contentType.includes('application/json')) {
      payload = safeJsonParse(rawBody);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      payload = Object.fromEntries(new URLSearchParams(rawBody));
    } else {
      try {
        payload = Object.fromEntries(new URLSearchParams(rawBody));
      } catch (_) {
        payload = safeJsonParse(rawBody);
      }
    }

    const name = stringOrEmpty(payload.name);
    const email = stringOrEmpty(payload.email);
    const subject = stringOrEmpty(payload.subject) || 'New message from contact form';
    const message = stringOrEmpty(payload.message);

    if (!name || !email || !message) {
      res.status(200).json({ type: 'danger', message: 'Please provide name, email, and message.' });
      return;
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Contact Form <onboarding@resend.dev>';

    if (!resendApiKey || !toEmail) {
      res.status(200).json({ type: 'danger', message: 'Email service not configured. Please set RESEND_API_KEY and CONTACT_TO_EMAIL.' });
      return;
    }

    const resend = new Resend(resendApiKey);

    const emailText = [
      'You have a new message from contact form',
      '=============================',
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      'Message:',
      message
    ].join('\n');

    const emailHtml = `
      <div>
        <p>You have a new message from contact form</p>
        <hr/>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap;word-wrap:break-word;">${escapeHtml(message)}</pre>
      </div>
    `;

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      text: emailText,
      html: emailHtml,
      reply_to: email
    });

    res.status(200).json({ type: 'success', message: okMessage });
  } catch (err) {
    res.status(200).json({ type: 'danger', message: errorMessage });
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function safeJsonParse(text) {
  try {
    return text ? JSON.parse(text) : {};
  } catch (_) {
    return {};
  }
}

function stringOrEmpty(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(input) {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
