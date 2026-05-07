const { processUSSDRequest } = require('../services/ussdService');

const handleUSSD = async (req, res) => {
  try {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    const response = await processUSSDRequest({
      sessionId,
      serviceCode,
      phoneNumber,
      text
    });

    res.json({ response });
  } catch (error) {
    console.error('USSD Error:', error);
    res.status(500).json({
      response: 'END An error occurred. Please try again.'
    });
  }
};

module.exports = { handleUSSD };