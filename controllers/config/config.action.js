require("dotenv").config();

module.exports.getConfig = async (req, res) => {
    try {
      res.status(200).send({ org: process.env.ORG_NAME ,currency:process.env.CURRENCY, tax: process.env.SALES_TAX});
    } catch (err) {
      console.log(err.message);
      res.send({ message: err.message, error: true });
    }
  };
  