require('../../models/User');
const mongoose = require("mongoose");
const User = mongoose.model("user");
const { SUPERADMIN } = require("../../enum/accessTypes");

const searchUserProfile = async (req, res) => {
    try {
        // Validate that req.user exists and has necessary fields
        if (!req.user || !req.user.id || !req.user.email) {
            return res.status(400).json({ status: "ERROR", message: "Invalid user information" });
        }

        // Trim the search query to remove leading and trailing spaces
        const searchQuery = req.query.search ? req.query.search.trim() : "";
        
        // Check if the search key is empty after trimming
        if (searchQuery === "") {
            return res.send({ status: "ERROR", message: "Search key cannot be empty" });
        }

        const searchTerms = searchQuery.split(' ').map(term => term.trim()).filter(term => term);

        let keyword = {};
        if (searchTerms.length > 0) {
            const regexTerms = searchTerms.map(term => new RegExp(term, 'i'));
            keyword = {
                $or: [
                    { fname: { $in: regexTerms } },
                    { lname: { $in: regexTerms } },
                    { email: { $in: regexTerms } },
                    { interests: { $in: regexTerms } },
                ]
            };
        }

        const query = {
            ...keyword,
            _id: { $ne: req.user.id },
            access: { $ne: SUPERADMIN },
        };

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        // Use aggregation framework to calculate relevance score and paginate
        const users = await User.aggregate([
            { $match: query },
            {
                $addFields: {
                    relevance: {
                        $size: {
                            $filter: {
                                input: searchTerms, // Array of search terms
                                as: "term", // Variable name for each search term in the filter
                                cond: {
                                    $or: [
                                        { $regexMatch: { input: "$fname", regex: "$$term", options: "i" } },
                                        { $regexMatch: { input: "$lname", regex: "$$term", options: "i" } },
                                        { $regexMatch: { input: "$email", regex: "$$term", options: "i" } }
                                    ]
                                }
                            }
                        }
                    }
                }
            },
            { $sort: { relevance: -1 } },
            { $skip: skip },
            { $limit: limit },
            { $project: { fname: 1, lname: 1, email: 1, relevance: 1 } }
        ]);

        if (users.length > 0) {
            const response = {
                status: "OK",
                data: users.map(user => ({
                    fullName: user.fname + " " + user.lname,
                    email: user.email
                })),
                page,
                limit,
                totalResults: users.length
            };
            res.send(response);
        } else {
            res.send({ status: "ERROR", message: "No users found" });
        }
    } catch (error) {
        res.send({ status: "ERROR", message: error.message });
    }
};

module.exports = { searchUserProfile };
