const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({message: "Nom"});
})

const name = [
    {username: 'Bobo', tweets: ['Tweet1', 'Tweet2', 'Tweet3'], following: []},
    {username: 'Baba', tweets: ['Tweet1', 'Tweet2'], following: []}
];


router.get("/:username", (req, res) => {
    const username = req.params.username;
    const user = name.find(user => user.username === username);
    if (!user) {
        res.status(404).json({
            message: 'Not Found',
        });

    }
    let x = parseInt(req.query.x);
    if (isNaN(x) || x <= 0) {
        x = user.tweets.length;
    }

    const tweets = user.tweets.slice(0, x);
    res.status(200).json({username: username, tweets: tweets});
});
router.post("/:followerUsername/follow/:followedUsername", (req, res) => {
    const followerUsername = req.params.followerUsername;
    const followedUsername = req.params.followedUsername;

    const follower = name.find(user => user.username === followerUsername);
    const followed = name.find(user => user.username === followedUsername);

    if (!follower || !followed) {
        res.status(404).json({message: 'Not Found'});
        return;
    }

    if (follower.following.includes(followedUsername)) {
        res.status(400).json({message: 'Already following'});
        return;
    }

    follower.following.push(followedUsername);
    res.status(200).json({message: `${followerUsername} is now following ${followedUsername}`});
});
router.delete("/:followerUsername/unfollow/:followedUsername", (req, res) => {
    const followerUsername = req.params.followerUsername;
    const followedUsername = req.params.followedUsername;

    const follower = name.find(user => user.username === followerUsername);
    const followed = name.find(user => user.username === followedUsername);

    if (!follower || !followed) {
        res.status(404).json({message: 'Not Found'});
        return;
    }

    const followedIndex = follower.following.indexOf(followedUsername);
    if (followedIndex === -1) {
        res.status(400).json({message: `${followerUsername} is not following ${followedUsername}`});
        return;
    }

    follower.following.splice(followedIndex, 1);
    res.status(200).json({message: `${followerUsername} has unfollowed ${followedUsername}`});
});


module.exports = router;

