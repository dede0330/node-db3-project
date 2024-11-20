const db = require('../../data/db-config');

// Get all schemes
function find() {
  return db('schemes')
    .leftJoin('steps', 'schemes.scheme_id', 'steps.scheme_id')
    .select('schemes.scheme_id', 'scheme_name', db.raw('COUNT(steps.step_id) AS number_of_steps'))
    .groupBy('schemes.scheme_id', 'scheme_name');
}


// Get scheme by ID
function findById(scheme_id) {
  return db('schemes')
    .where({ scheme_id })
    .first()
    .then(scheme => {
      if (scheme) {
        return db('steps')
          .where({ scheme_id })
          .orderBy('step_number', 'asc')
          .then(steps => ({
            ...scheme,
            steps
          }));
      }
      return null;
    });
}

// Get steps for a scheme
function findSteps(scheme_id) {
  return db('steps')
    .join('schemes', 'schemes.scheme_id', 'steps.scheme_id')
    .select('steps.step_id', 'schemes.scheme_name', 'steps.step_number', 'steps.instructions')
    .where('steps.scheme_id', scheme_id)
    .orderBy('steps.step_number', 'asc');
}

// Add new scheme
function add(scheme) {
  return db('schemes')
    .insert(scheme)
    .then(([id]) => findById(id));
}

// Add step to existing scheme
function addStep(scheme_id, step) {
  return db('steps')
    .insert({ ...step, scheme_id })
    .then(() => findSteps(scheme_id));
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};