import React from 'react';
import axios from 'axios';

interface ImageUploadProps {
    setImagePath: (path: string) => void; // Fonction pour mettre à jour le chemin de l'image
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setImagePath }) => {
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('http://127.0.0.1:8000/upload', formData);
                const imagePath = response.data.imagePath; // Récupérer le chemin d'image
                setImagePath(imagePath); // Mettre à jour le chemin d'image dans le parent
            } catch (error) {
                console.error("Erreur lors de l'upload de l'image", error);
            }
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageUpload} />
        </div>
    );
};

export default ImageUpload;