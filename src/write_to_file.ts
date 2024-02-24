import * as fs from 'fs';

const write_to_file = (content: string, file_name: string): void => {
  try {
    // Write the content to the file
    fs.writeFileSync(file_name, content, 'utf-8');
    console.log(`Content written to ${file_name} successfully.`);
  } catch (error) {
    console.error(`Error writing to ${file_name}: ${error}`);
  }
};

export default write_to_file;

// Example usage:
// const content_to_write = 'Hello, this is the content of the file.';
// const target_file_name = 'example.txt';

// write_to_file(content_to_write, target_file_name);
