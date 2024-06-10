const Dashboard = require("../model/dashboardSchema");

module.exports = {
  getDashboardData: async (req, res) => {
    try {
      let query = {};
      if (req.query.author) {
        query.author = req.query.author;
      }
      if (req.query.publication_year) {
        query.publication_year = req.query.publication_year;
      }
      const dashboards = await Dashboard.find(query);
      res.send(dashboards);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
