// cloudinaryService
import axios from 'axios';

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );

        if (response.data && response.data.secure_url) {
            return response.data.secure_url;
        } else {
            return "https://via.placeholder.com/150";
        }
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return "https://via.placeholder.com/150";
    }
};

export default uploadImage;