const { transporter, accountEmail } = require('./config/nodemailer');
const { emailTemplates } = require('./utils/email-template');
const dayjs = require('dayjs');
const nodemailer = require('nodemailer'); // Add this import

// Test function to send an email
async function testEmail() {
  try {
    console.log('Starting email test...');

    //  mock subscription object
    const mockSubscription = {
      _id: 'test123',
      name: 'Netflix Premium',
      renewalDate: dayjs().add(10, 'day').toDate(),
      price: 19.99,
      currency: 'USD',
      frequency: 'monthly',
      paymentMethod: 'Credit Card (ending in 1234)',
      status: 'active',
      user: {
        name: 'Test User',
        email: 'wanzalaisabella@gmail.com',
      },
      toObject: function () {
        return {
          _id: this._id,
          name: this.name,
          renewalDate: this.renewalDate,
          price: this.price,
          currency: this.currency,
          frequency: this.frequency,
          paymentMethod: this.paymentMethod,
          status: this.status,
          user: this.user,
        };
      },
    };

    // Find the subscription_reminder template
    const template = emailTemplates.find(
      (t) => t.label === 'subscription_reminder'
    );

    if (!template) {
      console.error('Template not found!');
      return;
    }

    console.log('Template found:', template.label);

    // Prepare email data with all required fields
    const emailData = {
      userName: mockSubscription.user.name,
      subscriptionName: mockSubscription.name,
      renewalDate: dayjs(mockSubscription.renewalDate).format('MMM D, YYYY'),
      planName: mockSubscription.name,
      price: `${mockSubscription.currency} ${mockSubscription.price} (${mockSubscription.frequency})`,
      paymentMethod: mockSubscription.paymentMethod,
      daysBefore: 7,
      sleepMessage:
        'Sleeping until 7 days before reminder at ' +
        dayjs().add(3, 'day').format('MMM D, YYYY'),
      reminderType: '7 days before renewal',
      // Include the full subscription data as well
      ...mockSubscription.toObject(),
    };

    // Generate email content
    const message = template.generateBody(emailData);
    const subject = template.generateSubject(emailData);

    console.log('Generated subject:', subject);
    console.log('Email data:', {
      userName: emailData.userName,
      subscriptionName: emailData.subscriptionName,
      renewalDate: emailData.renewalDate,
      planName: emailData.planName,
      price: emailData.price,
    });

    // Send the test email
    const mailOptions = {
      from: accountEmail,
      to: mockSubscription.user.email,
      subject: subject,
      html: message,
    };

    console.log('Sending email to:', mockSubscription.user.email);

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

    // Only try to get test message URL if using ethereal email (not for Gmail)
    if (info.messageId && info.messageId.includes('ethereal')) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Run the test
testEmail().then(() => console.log('Test completed'));
