const express = require('express');
const router = express.Router();
const {
    getTeamMembers,
    getTeamMember,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamStats,
} = require('../controllers/teamController');

// GET /api/team/stats - Get team statistics
router.get('/stats', getTeamStats);

// GET /api/team - Get all team members
router.get('/', getTeamMembers);

// GET /api/team/:id - Get single team member
router.get('/:id', getTeamMember);

// POST /api/team - Create new team member
router.post('/', createTeamMember);

// PUT /api/team/:id - Update team member
router.put('/:id', updateTeamMember);

// DELETE /api/team/:id - Delete team member
router.delete('/:id', deleteTeamMember);

module.exports = router;
