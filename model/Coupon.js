import mongoose from "mongoose";
const Schema = mongoose.Schema;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ---- Virtuals ----
couponSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date();
});

couponSchema.virtual("daysLeft").get(function () {
  const diff = this.endDate - new Date();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return `${daysLeft} days left`;
});

// ---- Validations ----
couponSchema.pre("validate", function (next) {
  const now = new Date();
  now.setHours(0, 0, 0, 0); // strip time portion for comparisons

  if (this.startDate < now) {
    return next(new Error("The start date cannot be earlier than today"));
  }

  if (this.endDate < now) {
    return next(new Error("The end date cannot be earlier than today"));
  }

  if (this.endDate < this.startDate) {
    return next(new Error("The end date cannot be before the start date"));
  }

  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
