import * as fs from 'fs';

const write_to_file = (content: string, file_name: string): void => {
  try {
    fs.writeFileSync(file_name, content, 'utf-8');
    console.log(`Content written to ${file_name} successfully.`);
  } catch (error) {
    console.error(`Error writing to ${file_name}: ${error}`);
  }
};

export default write_to_file;
