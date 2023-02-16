/** @returns {Promise<import('jest').Config>} */
module.exports = async () => {
  return {
    verbose: true,
    testMatch: ["**/*.test.js"],
    testEnvironment: "jsdom",
  };
};
