import { Schema, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';
const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;;

export interface User extends Document {
    name: string;
    email: string;
    password: string; // Store hashed password (omitted for brevity)
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ courseId: string }>;
    comparePassword: (password: string) => Promise<boolean>
}

const userSchema = new Schema<User>({
    name: { type: String, required: [true, "Please enter your name"] },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true, // Ensure unique email addresses
        validate: {
            validator: (email: string) => emailRegex.test(email),
            message: 'Please enter a valid email address.',
        },
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Please enter at least 6 characters"],
        select: false
    }, // Store hashed password (omitted)
    avatar: {
        public_id: String,
        url: String,
    },
    role: { type: String, required: true, default: 'user' }, // Default role to 'user'
    isVerified: { type: Boolean, required: true, default: false },
    courses: [
        {
            courseId: String
        }
    ],
}, { timestamps: true });

// Hash password before saving the user
userSchema.pre('save', async function (next) {
    const user = this as User; // Implicitly cast to User type

    if (!user.isModified('password')) {
        return next(); // Skip hashing if password hasn't changed
    }
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

// compare password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = model<User>('User', userSchema);

export default userModel