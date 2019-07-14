const axios = require('axios');
const boredApi = axios.create({ baseURL: 'http://www.boredapi.com/api' })
const qouteApi = axios.create({ baseURL: "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json" })

class ApiController {
  static randomTask(req, res, next) {
    boredApi.get('/activity')
      .then(({ data }) => {
        res.status(200).json(data.activity)
      })
      .catch(next)
  }

  static generateRandomQuote(req, res, next) {
    qouteApi.get('')
      .then(({ data }) => {
        res.status(200).json(data)
      })
      .catch(next)
  }
}

module.exports = ApiController