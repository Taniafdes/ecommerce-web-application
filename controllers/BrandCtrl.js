import asyncHandler from "express-async-handler";
import Brands from "../model/Brands.js";

export const createBrandCtrl= asyncHandler(async(req, res)=> {
    const { name } = req.body;
    const brandExist = await Brands.findOne({name})
    if(brandExist) {
        throw new Error('Brand not found')
    }
    const createBrand = await Brands.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    })
    res.json({
        status: 'success',
        msg: 'Brand added',
        createBrand
    })
}
)

export const getAllBrandCtrl = asyncHandler(async(req, res)=> {
    const allBrand = await Brands.find()
    res.json({
        status: 'success',
        msg: 'All Brands',
        allBrand
    })
}
)

export const getSingleBrandCtrl = asyncHandler(async(req, res)=> {
    const brand = await Brands.findById(req.params.id)

    res.json({
        status: 'success',
        msg: 'Single Brand fetched',
        brand
    })
}
)

export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name} = req.body;

  const brand = await Brands.findByIdAndUpdate(
    req.params.id,
    {
     name   },
    { new: true }
  );

  if (!brand) {
    res.status(404);
    throw new Error("Brand not found");
  }

  res.json({
    msg: "Brand updated successfully",
    brand,
  });
});

export const deleteBrandCtrl = asyncHandler( async (req, res) => {
    
    await Brands.findByIdAndDelete(req.params.id);
    
    res.json({
        status: "success",
        msg: "Brands deleted successfully",
    })
});