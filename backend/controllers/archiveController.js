import mongoose from 'mongoose';
import { deleteAttachments } from './attachmentController.js';

// model
import Archive from '../models/archive.js';

// get all archives
const getArchives = async (req, res) => {
    let { page, limit, ...filters } = req.query;

    page = parseInt(page || 0);
    limit = parseInt(limit || 0);

    let startIndex = (page - 1) * limit;
    let endIndex = page * limit;
    let totalPages = 0;

    // format the filters for mongodb
    if (filters.customer) {
        filters.customer = { $regex: filters.customer };
    };

    if (filters.reference) {
        filters.reference = { $regex: filters.reference };
    };

    if (filters.mileageGTE) {
        filters.mileage = { $gte: filters.mileageGTE };
        delete filters.mileageGTE;
    };

    if (filters.mileageLTE) {
        filters.mileage = { ...filters.mileage, $lte: filters.mileageLTE };
        delete filters.mileageLTE;
    };

    if (filters.createdOnGTE) {
        filters.createdAt = { $gte: filters.createdOnGTE };
        delete filters.createdOnGTE;
    };

    if (filters.createdOnLTE) {
        filters.createdAt = { ...filters.createdAt, $lte: filters.createdOnLTE };
        delete filters.createdOnLTE;
    };

    if (filters.pickupOnGTE) {
        filters['pickup.date'] = { $gte: filters.pickupOnGTE };
        delete filters.pickupOnGTE;
    };

    if (filters.pickupOnLTE) {
        filters['pickup.date'] = { ...filters['pickup.date'], $lte: filters.pickupOnLTE };
        delete filters.pickupOnLTE;
    };

    if (filters.deliveryOnGTE) {
        filters['delivery.date'] = { $gte: filters.deliveryOnGTE };
        delete filters.deliveryOnGTE;
    };

    if (filters.deliveryOnLTE) {
        filters['delivery.date'] = { ...filters['delivery.date'], $lte: filters.deliveryOnLTE };
        delete filters.deliveryOnLTE;
    };

    console.log('filters:', filters);

    const archives = await Archive.find(filters);
    const count = archives.length;
    totalPages = Math.floor(count / limit);

    if (count > limit) totalPages += (count % limit) === 0 ? 0 : 1;

    // set boundaries for safety
    if (!limit || limit === 0 || limit > count || startIndex > count) {
        startIndex = 0;
        endIndex = archives.length;
        totalPages = 1;
    };

    const results = archives.splice(startIndex, endIndex);

    return res.status(200).json({ count, results, totalPages });
}

// create a new archive
const createArchive = async (req, res) => {
    try {
        const archive = await Archive.create({ ...req.body });

        return res.status(200).json(archive);

    } catch (err) {
        console.error(err);

        return res.status(400).json(err);
    };
};

// delete an archive
const deleteArchive = async (req, res) => {
    const { _id } = req.params;
    const error = { message: 'Cannot find archive.' };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const archive = await Archive.findByIdAndDelete(_id);

    if (!archive) return res.status(404).json({ error });

    // after the arhive has been deleted loop through all notes and deleted all attachments
    archive.notes.forEach(({ attachments }) => deleteAttachments(attachments.map(attachment => ({ id: attachment.files_id }))));

    return res.status(200).json(archive);
};

// update an archive
const updateArchive = async (req, res) => {
    const { _id } = req.params;
    const error = { message: 'Cannot find archive.' };

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error });
    };

    const archive = await Archive.findByIdAndUpdate(_id, { ...req.body });

    if (!archive) return res.status(404).json({ error });

    return res.status(200).json(archive);
};

export { createArchive, deleteArchive, getArchives, updateArchive };