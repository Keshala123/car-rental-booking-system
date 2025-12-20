/**
 * Contact Controller
 * Request handlers for contact form submissions
 */

import Contact from '../models/Contact.js';

/**
 * Get all contact submissions
 * GET /api/contact
 */
export const getContacts = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions',
      error: error.message,
    });
  }
};

/**
 * Create new contact submission
 * POST /api/contact
 */
export const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message,
    });
  }
};

/**
 * Update contact status
 * PATCH /api/contact/:id
 */
export const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update contact status',
      error: error.message,
    });
  }
};
