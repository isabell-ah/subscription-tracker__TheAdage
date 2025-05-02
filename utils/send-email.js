const { transporter, accountEmail } = require('../config/nodemailer');
const { emailTemplates } = require('./email-template');
const dayjs = require('dayjs');

const sendReminderEmail = async ({ to, type, subscription }) => {
  try {
    console.log(`Attempting to send ${type} email to ${to}`);

    if (!to || !type) {
      console.error('Missing required parameters:', { to, type });
      throw new Error('Missing required parameters');
    }

    const template = emailTemplates.find((t) => t.label === type);
    if (!template) {
      console.error(`Invalid email type: ${type}`);
      throw new Error('Invalid email type');
    }

    console.log('Found template:', template.label);

    // Make sure subscription has toObject method or is already an object
    const subscriptionData = subscription.toObject
      ? subscription.toObject()
      : subscription;

    const mailInfo = {
      userName: subscriptionData.user.name,
      subscriptionName: subscriptionData.name,
      renewalDate: dayjs(subscriptionData.renewalDate).format('MMM D, YYYY'),
      planName: subscriptionData.name,
      price: `${subscriptionData.currency} ${subscriptionData.price} (${subscriptionData.frequency})`,
      paymentMethod: subscriptionData.paymentMethod,
      // Pass through any additional properties
      ...subscriptionData,
    };

    console.log('Generating email with data:', {
      type,
      userName: mailInfo.userName,
      subscriptionName: mailInfo.subscriptionName,
      daysBefore: mailInfo.daysBefore,
      sleepMessage: mailInfo.sleepMessage,
    });

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
      from: accountEmail,
      to: to,
      subject: subject,
      html: message,
    };

    console.log(`Sending email to ${to} with subject: ${subject}`);

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent successfully:', info.response);
          resolve(info);
        }
      });
    });
  } catch (error) {
    console.error('Error in sendReminderEmail:', error);
    throw error;
  }
};

module.exports = sendReminderEmail;
