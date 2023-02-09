import { Action, ActionPanel, Clipboard, Form, showHUD, showToast, Toast } from "@raycast/api";
import cp from "child_process";
import fs from "fs";
import { basename } from "path";
import { promisify } from "util";

const exec = promisify(cp.exec);

const upload = async (file: string) => {
  // Execute a curl command to upload the file to the server
  try {
    const { stdout } = await exec(`curl 0x0.st -F'file=@${file}'`);

    const fileName = basename(file);

    // Add custom filename to the URL
    const url = `${stdout.trim()}/${fileName}`;

    Clipboard.copy(url);

    showToast({
      title: `Upload successful for '${fileName}'`,
      message: "The URL has been copied to your clipboard",
    });
    showHUD(`📋 Copied URL to clipboard`);

    return stdout;
  } catch (error) {
    console.error(error);
  }
};

// http://0x0.st/HrsF.xlsx

export default function Command() {
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Upload File"
            onSubmit={async (values: { files: string[] }) => {
              const file = values.files[0];
              if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
                return false;
              }
              console.log(file);

              const url = await upload(file);

              console.log(url);
            }}
          />
        </ActionPanel>
      }
    >
      <Form.FilePicker id="files" title="File" allowMultipleSelection={false} />
    </Form>
  );
}
