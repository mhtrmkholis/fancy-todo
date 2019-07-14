module.exports = () => {
  let generator = require('generate-password');
  let password = generator.generate({
    length: 10,
    numbers: true
  });
  return password
}