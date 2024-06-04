const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// To find all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// To find a single tag by its `id`
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }]
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this ID' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//To create a new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(201).json(tagData);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(error => error.message);
      res.status(400).json({ errors});
    } else {
      res.status(
        500).json({ error: 'Failed to create tag'})
    }
  }
  
});

// To update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.update(req.body, {
      where: {id: req.params.id }
    });
    if (updatedTag[0] === 0) {
      return res.status(404).json({message: 'Tag not found'});
    }

    res.status(200).json({ message: 'Tag updated successfully'});
  }catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//To delete a tag by id
router.delete('/:id', async (req, res) => {
  try {
    const deletedRows = await Tag.destroy({
      where: { id: req.params.id }
    });

    if (deletedRows === 0) {
      res.status(404).json({ message: 'No tag with this ID' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: 'An error occurred while deleting the tag' });
  }
});

module.exports = router;
