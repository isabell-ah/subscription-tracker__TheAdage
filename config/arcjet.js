// arcjet.js
const initArcjet = async () => {
  try {
    const arcjetModule = await import('@arcjet/node');

    let aj = arcjetModule.default({
      key: process.env.ARCJET_KEY,
      characteristics: ['ip.src'],
      rules: [
        arcjetModule.shield({ mode: 'LIVE' }),
        arcjetModule.detectBot({
          mode: 'LIVE',
          allow: ['CATEGORY:SEARCH_ENGINE'],
        }),
        arcjetModule.tokenBucket({
          mode: 'LIVE',
          refillRate: 5,
          interval: 10,
          capacity: 10,
        }),
      ],
    });

    if (!aj || typeof aj.protect !== 'function') {
      throw new Error('Arcjet instance not properly initialized');
    }
    return aj;
  } catch (error) {
    console.error('Arcjet initialization error:', error);
    throw error;
  }
};

module.exports = initArcjet();
