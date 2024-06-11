import { storage } from './firebase';

const getImageUrl = async (imageName) => {
  try {
    const url = await storage.ref(`map/${imageName}`).getDownloadURL();
    return url;
  } catch (error) {
    console.error("Error fetching image: ", error);
    return null;
  }
};

export default getImageUrl;
