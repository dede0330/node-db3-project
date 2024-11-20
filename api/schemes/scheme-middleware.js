const Scheme = require('./scheme-model');

// Middleware to check if scheme ID exists
async function checkSchemeId(req, res, next) {
  try {
    const scheme = await Scheme.findById(req.params.scheme_id);
    if (!scheme) {
      return res.status(404).json({ message: `scheme with scheme_id ${req.params.scheme_id} not found` });
    }
    req.scheme = scheme;
    next();
  } catch (err) {
    next(err);
  }
}

// Middleware to validate scheme body
function validateScheme(req, res, next) {
  const { scheme_name } = req.body;
  if (!scheme_name || typeof scheme_name !== 'string') {
    return res.status(400).json({ message: 'invalid scheme_name' });
  }else{
  next();
}
}

// Middleware to validate step
function validateStep(req, res, next) {
  const { step_number, instructions } = req.body;
  
  if (typeof step_number !== 'number' || step_number <= 0) {
    return res.status(400).json({ message: 'invalid step' });
  }
  
  if (!instructions || typeof instructions !== 'string') {
    return res.status(400).json({ message: 'invalid step' });
  }
  
  next();
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};