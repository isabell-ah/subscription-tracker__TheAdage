const Subscriptions = require('../models/subscription.model');
const { SERVER_URL } = require('../config/env');
const { workflowClient } = require('../config/upstash');

const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscriptions.create({
      ...req.body,
      user: req.user._id,
    });

    console.log(`Triggering workflow for subscription ${subscription._id}`);
    const workflow = await workflowClient.trigger({
      url: `${SERVER_URL}/api/workflow/subscription/reminder`,
      // url: `${SERVER_URL}/api/workflow/subscription/reminder`,
      // body: { subscriptionId: subscription._id },
      // headers: { 'content-type': '/application/json' },
      // retries: 0,
    });
    console.log('Workflow triggered:', workflow);
    res.status(201).json({
      success: true,
      data: subscription,
      workflow: {
        message: 'Workflow triggered successfully',
        workflow,
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const getSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id != req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }
    const subscriptions = await Subscriptions.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSubscription, getSubscriptions };
