## Setup

Jump into the `app` directory and install the dependencies. The scaffold was created with
`npx create-react-app my-app --template typescript`.

You can start the project with `npm start`.

Features

- The component can retrieve either a `string` or `Uint8Array`.
- The Hex viewer is responsive and each part of the line is match (hex value is match with the text value line by line).
- The component is able to display the bytes as hex and readable text side by side.
- Non-readable characters is replaced with a special character.
- Able to select one part of the hex viewer and automatically the other part gets highlighted as well.
- The possibility to then copy the selected hex value or text (depending on what was selected).
