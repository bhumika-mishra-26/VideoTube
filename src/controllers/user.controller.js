import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import uploadToCloudinary from '../utils/cloudinary.js'; 
import ApiResponse from '../utils/ApiRespone.js';  


const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from frontend (req.body)
    const { fullName, email, username, password } = req.body;

    // 2. Validation - check if fields are not empty
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // 3. Check if user already exists: username, email
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }
    console.log(req.files);
    console.log(req.text);

    // 4. Check for images, check for avatar
    console.log("Files received by Multer:", req.files);
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log("Avatar local path:", avatarLocalPath);
    console.log("Cover image local path:", coverImageLocalPath);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    // 5. Upload them to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);
console.log("CLOUDINARY RESPONSE:", avatar);
    if (!avatar) {
        throw new ApiError(400, "Avatar is required and failed to upload");
    }

    // 6. Create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password
    });

    // 7. Check for user creation
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 8. Return response to frontend
    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", createdUser)
    );
});


export {
    registerUser
};