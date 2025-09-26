import Categories from "../model/Categories.js";
import asyncHandler from "express-async-handler";

export const createCategoryCtrl= asyncHandler(async(req, res)=> {
    const { name } = req.body;
    const Categoryexist = await Categories.findOne({name})
    if(Categoryexist) {
        throw new Error('Category not found')
    }
    const createCat = await Categories.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
        image: req.file.path,
    })
    res.json({
        status: 'success',
        msg: 'Categories added',
        createCat
    })
}
)

export const getAllCategoriesCtrl = asyncHandler(async(req, res)=> {
    const allCategories = await Categories.find()
    res.json({
        status: 'success',
        msg: 'All Categories',
        allCategories
    })
}
)

export const getSingleCategoriesCtrl = asyncHandler(async(req, res)=> {
    const category = await Categories.findById(req.params.id)

    res.json({
        status: 'success',
        msg: 'Single Category fetched',
        category
    })
}
)

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name} = req.body;

  const categories = await Categories.findByIdAndUpdate(
    req.params.id,
    {
     name   },
    { new: true }
  );

  if (!categories) {
    res.status(404);
    throw new Error("Categories not found");
  }

  res.json({
    msg: "Categories updated successfully",
    categories,
  });
});

export const deleteCategoryCtrl = asyncHandler( async (req, res) => {
    
    await Categories.findByIdAndDelete(req.params.id);
    
    res.json({
        status: "success",
        msg: "Category deleted successfully",
    })
});