const queryDetails = require("../../models/botModels/queryModel");

async function getuserQueries(req, res) {
  try {
    const limit = 10;
    const queries = await getQueries(limit);
    res.json(queries);
  } catch (error) {
    console.error("API error:", error);
    console.log("Error in getuserQueries controller,", error.name, ":", error.message);
    res.status(500).json({ error: error.message });
  }
}

async function getQueries(limit = 4) {
  try {
    const botQueries = await queryDetails.aggregate([
      {
        $group: {
          _id: "$userQuery",       
          count: { $sum: 1 }        
        }
      },
      { $sort: { count: -1 } },    
      { $limit: limit }             
    ]).exec();

    console.log("Most asked queries:");
    botQueries.forEach((q, i) =>
      console.log(`${i + 1}. "${q._id}" — asked ${q.count} times`)
    );

    return botQueries;
  } catch (error) {
    console.error("Error in getQueries controller:", error.name, ":", error.message);
    throw error; // Let the caller handle the response
  }
}

module.exports = { getuserQueries };
