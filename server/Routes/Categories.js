const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// --- 1. GET ALL CATEGORIES 

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories); 
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// --- 2. GET SINGLE CATEGORY (Find Category by ID) ---

router.get('/:id', async (req, res) => {
  try { 
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }   
    res.json(category);
  } catch (error) {
    // Catch invalid format ID errors (e.g., non-MongoDB ObjectId)
    res.status(500).json({ message: 'Server error', error: error.message }); 
  }
});



// ROUTE: POST /api/categories

router.post('/', auth, async (req, res) => {
  // The 'auth' middleware secures this route.
  const { name, slug } = req.body; 

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ message: 'Category already exists' });
    }

   
    category = new Category({
      name,
      slug: slug || name.toLowerCase().replace(/ /g, '-') 
    });

    await category.save();
    
 
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error.message);
    res.status(500).json({ message: 'Server error while creating category' });
  }
});


// --- 4. DELETE A CATEGORY ---

router.delete('/:id', auth, async (req, res) => {
  
  try {
    const { id } = req.params;
    
    
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found' });
    }

 
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}); 

module.exports = router;