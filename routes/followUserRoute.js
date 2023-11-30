const express = require('express');
const router = express.Router();
const {saveFollowUsers, getFollowedUser, findDocumentsWithCurrentId, deleteFollowedUser}  = require('../controllers/followUserController');

router.post('/save-followed-users',saveFollowUsers);
router.get('/get-followed-users/:userId', getFollowedUser);
router.get('/get-following-users/:currentId', findDocumentsWithCurrentId);
router.delete('/delete-followed-user/:userId/:idToRemove', deleteFollowedUser);

module.exports = router;