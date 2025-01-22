import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    // Convert base64 to buffer
    const base64Data = body.image.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');

    // Create a FormData instance
    const formData = new FormData();

    // Append the buffer as a file
    formData.append('file', new Blob([buffer]), 'image.jpg');

    const response = await fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to detect objects');
    }

    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error detecting objects:', error);
    return { error: 'Failed to detect objects' };
  }
});
