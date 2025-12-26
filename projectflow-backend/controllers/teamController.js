const TeamMember = require('../models/TeamMember');

exports.getTeamMembers = async (req, res) => {
    try {
        const members = await TeamMember.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.findByPk(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json(member);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTeamMember = async (req, res) => {
    try {
        const member = await TeamMember.create(req.body);
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTeamMember = async (req, res) => {
    try {
        const [updated] = await TeamMember.update(req.body, {
            where: { id: req.params.id }
        });
        if (!updated) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        const member = await TeamMember.findByPk(req.params.id);
        res.json(member);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTeamMember = async (req, res) => {
    try {
        const deleted = await TeamMember.destroy({
            where: { id: req.params.id }
        });
        if (!deleted) {
            return res.status(404).json({ message: 'Team member not found' });
        }
        res.json({ message: 'Team member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTeamStats = async (req, res) => {
    try {
        const total = await TeamMember.count();
        const online = await TeamMember.count({ where: { status: 'online' } });
        const members = await TeamMember.findAll();
        const totalTasks = members.reduce((sum, m) => sum + m.tasks, 0);

        res.json({
            totalMembers: total,
            onlineNow: online,
            activeTasks: totalTasks,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
