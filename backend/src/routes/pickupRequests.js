const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get pickup requests based on role
router.get('/', authenticateToken, async (req, res) => {
  try {
    let where = {};

    if (req.user.role === 'Citizen') {
      where.citizenId = req.user.id;
    } else if (req.user.role === 'Worker') {
      where.workerId = req.user.id;
    }
    // Admin sees all

    const requests = await prisma.pickupRequest.findMany({
      where,
      include: {
        citizen: { select: { name: true, email: true } },
        worker: { select: { name: true, email: true } },
      },
      orderBy: { pickupDate: 'asc' },
    });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create pickup request (Citizen only)
router.post('/', authenticateToken, authorizeRoles('Citizen'), async (req, res) => {
  try {
    const { address, garbageType, pickupDate } = req.body;

    const request = await prisma.pickupRequest.create({
      data: {
        address,
        garbageType,
        pickupDate: new Date(pickupDate),
        citizenId: req.user.id,
      },
      include: {
        citizen: { select: { name: true, email: true } },
      },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update status (Worker only, for assigned requests)
router.patch('/:id/status', authenticateToken, authorizeRoles('Worker'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if request is assigned to this worker
    const request = await prisma.pickupRequest.findUnique({ where: { id: parseInt(id) } });
    if (!request || request.workerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized for this request' });
    }

    const updatedRequest = await prisma.pickupRequest.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        citizen: { select: { name: true, email: true } },
        worker: { select: { name: true, email: true } },
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign worker to request (Admin only)
router.patch('/:id/assign', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;

    const updatedRequest = await prisma.pickupRequest.update({
      where: { id: parseInt(id) },
      data: { workerId: parseInt(workerId), status: 'Assigned' },
      include: {
        citizen: { select: { name: true, email: true } },
        worker: { select: { name: true, email: true } },
      },
    });

    res.json(updatedRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard stats (Admin only)
router.get('/stats', authenticateToken, authorizeRoles('Admin'), async (req, res) => {
  try {
    const total = await prisma.pickupRequest.count();
    const pending = await prisma.pickupRequest.count({ where: { status: 'Pending' } });
    const collected = await prisma.pickupRequest.count({ where: { status: 'Collected' } });

    res.json({ total, pending, collected });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;