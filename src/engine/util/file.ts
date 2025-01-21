export async function loadJsonFile(filePath: string): Promise<any> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON file:', error);
    throw error;
  }
}