const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../util/parseStringAsArray')

module.exports = {

    async index(req, res) {

        const devs = await Dev.find();

        return res.json(devs);
    },

    async store(req, res) {
        const { github_username, techs, lat, log } = req.body;

        let dev = await Dev.findOne({ github_username });
        if (!dev) {

            const apiRes = await axios.get(`https://api.github.com/users/${github_username}`)
            const { name = login, avatar_url, bio } = apiRes.data;
            const techsArray = parseStringAsArray(techs)
            const location = { type: 'Point', coordinates: [log, lat] }
            dev = await Dev.create({
                name,
                github_username,
                bio,
                avatar_url,
                techs: techsArray,
                location
            })
        }
        return res.json(dev);
    }
};
