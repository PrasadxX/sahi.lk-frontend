import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
    orderId: { type: String, required: true, unique: true },
    products: [{
        _id: String,
        title: String,
        price: Number,
        quantity: Number,
    }],
    // Customer Information
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: { type: String }, // Combined name for compatibility
    email: { type: String, required: true },
    phone: { type: String, required: true },
    
    // Shipping Address
    address: { type: String, required: true },
    streetAddress: { type: String }, // Alias for compatibility
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    province: { type: String },
    district: { type: String },
    
    // Order Details
    notes: { type: String },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    
    // Payment
    paymentMethod: {
        type: String, 
        enum: ['cod', 'bank_transfer'], 
        required: true
    },
    bankSlipUrl: { type: String },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'pending_verification', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paid: { type: Boolean, default: false },
    trackingNumber: { type: String, default: '' },
    
    // Metadata
    orderDate: { type: Date, default: Date.now },
}, {
    timestamps: true
});

// Pre-save hook to set combined name
OrderSchema.pre('save', function(next) {
    if (this.firstName && this.lastName) {
        this.name = `${this.firstName} ${this.lastName}`;
    }
    if (this.address) {
        this.streetAddress = this.address;
    }
    next();
});

// Use this pattern for model definition with Next.js to prevent model recompilation issues
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
