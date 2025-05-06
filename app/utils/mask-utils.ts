export const createTransparentMask = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      // Create a canvas
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Make black pixels transparent
      for (let i = 0; i < data.length; i += 4) {
        // Check if pixel is black or dark
        const isBlack = data[i]! < 50 && data[i + 1]! < 50 && data[i + 2]! < 50;

        // If black, make transparent
        if (isBlack) {
          data[i + 3] = 0; // Alpha channel
        }
      }

      // Put the modified data back
      ctx.putImageData(imageData, 0, 0);

      // Return as data URL
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};
