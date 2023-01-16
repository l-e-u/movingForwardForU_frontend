import { Router } from 'express';

const router = Router();

// GET all jobs
router.get('/', (req, res) => {
    res.json({ msg: 'GET all jobs.' });
});

// GET a single job
router.get('/:id', (req, res) => {
    res.json({ msg: 'GET job: ' + req.params.id });
});

// POST a new job
router.post('/', (req, res) => {
    res.json({
        msg: 'POST a new job.',
        jobType: req.body.type,
        jobCarrier: req.body.carrier,
    });
});

// DELETE a job
router.delete('/:id', (req, res) => {
    res.json({ msg: 'DELETE a job number :' + req.params.id });
});

// UPDATE a job
router.patch('/:id', (req, res) => {
    res.json({ msg: 'UPDATE job: ' + req.params.id });
});

export default router;