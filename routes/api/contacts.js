const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { validationResult } = require('express-validator');

const Contact = require('../../models/Contact');


// @route    GET api/contact
// @desc     Get all contacts
// @access   Public
router.get('/', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.json(contacts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});


// @route    POST api/contact
// @desc     Create or update contact
// @access   Private
router.post('/', auth, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    // destructure the request
    const { data } = req.body;

    // build a contact
    const contactFields = {
      user: req.user.id,
      contacts: data 
    }

    try {
      // Using upsert option (creates new doc if no match is found):
      let contact = await Contact.findOneAndUpdate(
        { user: req.user.id },
        { $set: contactFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(contact);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
