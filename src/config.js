module.exports = {
  PORT: process.env.PORT || 1000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  DATABASE_URL:
    process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/endShift',

  TEST_DATABASE_URL:
    process.env.DB_URL || 'postgresql://dunder_mifflin@localhost/endShift_test'
};
