export async function loadJsonFile(file_path: string): Promise<any> {
  try {
    const response = await fetch(file_path);
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading JSON file:', error);
    throw error;
  }
}
