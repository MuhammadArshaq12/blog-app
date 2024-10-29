// lib/models/CategoryModel.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const CategoryModel = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default CategoryModel;
