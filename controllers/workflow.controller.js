const Subscription = require('../models/subscription.model');
const dayjs = require('dayjs');
const { serve } = require('@upstash/workflow');
const sendReminderEmail = require('../utils/send-email');

const Reminders = [7, 5, 2];

// Create a handler that can be used with Express
const sendReminders = serve({
  async handler(context) {
    try {
      console.log(
        'Workflow handler started with payload:',
        context.requestPayload
      );
      const { subscriptionId } = context.requestPayload;

      if (!subscriptionId) {
        console.error('No subscriptionId provided in payload');
        return { error: 'Missing subscriptionId' };
      }

      const subscription = await fetchSubscription(context, subscriptionId);
      console.log('Fetched subscription result:', subscription);

      if (!subscription) {
        return { error: 'Subscription not found' };
      }

      if (subscription.status !== 'active') {
        console.log(
          `Subscription ${subscriptionId} is not active. Status: ${subscription.status}`
        );
        return { status: 'skipped', reason: 'subscription not active' };
      }

      const renewalDate = dayjs(subscription.renewalDate);
      if (renewalDate.isBefore(dayjs())) {
        console.log(
          `Renewal date has passed for subscription ${subscriptionId}. Stopping workflow`
        );
        return { status: 'skipped', reason: 'renewal date passed' };
      }

      // Send initial notification about scheduled reminders
      await sendInitialNotification(subscription, renewalDate, Reminders);

      for (const daysBefore of Reminders) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        if (reminderDate.isAfter(dayjs())) {
          const sleepMessage = `Sleeping until ${daysBefore} days before reminder at ${reminderDate.format(
            'MMM D, YYYY'
          )}`;
          console.log(sleepMessage);

          // Store the sleep message in context for later use
          context.storage.set(`sleep_message_${daysBefore}`, sleepMessage);

          await context.sleepUntil(
            `Reminder ${daysBefore} days before`,
            reminderDate.toDate()
          );
        }

        await triggerReminder(
          context,
          `${daysBefore} days before reminder`,
          subscription,
          daysBefore
        );
      }

      return { status: 'completed', message: 'All reminders processed' };
    } catch (error) {
      console.error('Error in workflow:', error);
      return { error: error.message };
    }
  },
});

const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', () => {
    return Subscription.findById(subscriptionId).populate({
      path: 'user',
      select: 'name email',
    });
  });
};

// Send initial notification about all scheduled reminders
const sendInitialNotification = async (
  subscription,
  renewalDate,
  reminders
) => {
  try {
    const scheduledReminders = reminders
      .map((days) => {
        const reminderDate = renewalDate.subtract(days, 'day');
        if (reminderDate.isAfter(dayjs())) {
          return `- ${days} days before (${reminderDate.format(
            'MMM D, YYYY'
          )})`;
        }
        return null;
      })
      .filter(Boolean)
      .join('\n');

    if (scheduledReminders) {
      await sendReminderEmail({
        to: subscription.user.email,
        type: 'subscription_schedule',
        subscription: {
          ...subscription.toObject(),
          scheduledReminders,
          renewalDateFormatted: renewalDate.format('MMM D, YYYY'),
        },
      });
      console.log('Initial schedule notification sent');
    }
  } catch (error) {
    console.error('Failed to send initial notification:', error);
  }
};

const triggerReminder = async (context, label, subscription, daysBefore) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} for user ${subscription.user.email}`);

    try {
      // Get the sleep message if available
      const sleepMessage =
        context.storage.get(`sleep_message_${daysBefore}`) || '';

      await sendReminderEmail({
        to: subscription.user.email,
        type: 'subscription_reminder',
        subscription: {
          ...subscription.toObject(),
          daysBefore,
          sleepMessage,
          reminderType: `${daysBefore} days before renewal`,
        },
      });
      return { status: 'success', message: 'Reminder email sent' };
    } catch (error) {
      console.error('Failed to send reminder email:', error);
      return { status: 'error', message: error.message };
    }
  });
};

module.exports = { sendReminders };
