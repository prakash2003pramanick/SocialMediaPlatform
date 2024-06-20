const { query, validationResult } = require('express-validator');

const searchValidationRules = () => {
  return [
    query('search').optional().isString().withMessage('Search must be a string'),
  ];
};

module.exports = {searchValidationRules}