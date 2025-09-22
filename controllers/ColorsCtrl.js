import asyncHandler from "express-async-handler";
import Colors from "../model/Colors.js";

export const createColorsCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const ColorsExist = await Colors.findOne({ name })
    if (ColorsExist) {
        throw new Error('Colors not found')
    }
    const createColors = await Colors.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
    })
    res.json({
        status: 'success',
        msg: 'Colors added',
        createColors
    })
}
)

export const getAllColorsCtrl = asyncHandler(async (req, res) => {
    const allColors = await Colors.find()
    res.json({
        status: 'success',
        msg: 'All Colors',
        allColors
    })
}
)

export const getSingleColorsCtrl = asyncHandler(async (req, res) => {
    const colors = await Colors.findById(req.params.id)

    res.json({
        status: 'success',
        msg: 'Single Colors fetched',
        colors
    })
}
)

export const updateColorsCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const colors = await Colors.findByIdAndUpdate(
        req.params.id,
        {
            name
        },
        { new: true }
    );

    if (!colors) {
        res.status(404);
        throw new Error("Colors not found");
    }

    res.json({
        msg: "Colors updated successfully",
        colors,
    });
});

export const deleteColorsCtrl = asyncHandler(async (req, res) => {

    await Colors.findByIdAndDelete(req.params.id);

    res.json({
        status: "success",
        msg: "Colors deleted successfully",
    })
});