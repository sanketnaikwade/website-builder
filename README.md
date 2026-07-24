# WebCraft Builder

A modern, high-performance **Drag-and-Drop Web Page Builder** library built with **Vanilla JavaScript** and **Bootstrap 5**. Designed for creating, editing, and customizing responsive websites visually with zero build step dependencies on the client side.

Created and maintained by **Sanket Naikwade**.

---

## Features

- 🎨 **Visual Drag & Drop Editor**: Drag and drop components, sections, and layout blocks in real time.
- 📱 **Multi-Device Responsive Preview**: Toggle desktop, tablet landscape, tablet portrait, and mobile device viewports instantly.
- ⚡ **Zero Client-Side Build Tooling**: Fast, lightweight core built on pure Vanilla JS and Bootstrap 5.
- 📂 **Page & File Management**: Create new pages, switch templates, organize page hierarchy, and manage assets.
- 💾 **Instant Save & Export**: Save pages directly to the server filesystem or export HTML/ZIP archives.
- 🛠️ **Code & CSS Editors**: Integrated live code editing powered by CodeMirror syntax highlighting.
- 🖼️ **Integrated Media Manager**: Browse media galleries, upload custom images, and organize asset folders.
- 🧩 **Rich Widgets & Components**: Pre-packaged with Bootstrap 5 components, YouTube, Google Maps, Charts, SVG icons, and typography controls.

---

## Quick Start & Installation

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)

### Setup & Run Server

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local server**:
   ```bash
   node save.js
   ```

3. **Open in browser**:
   Navigate to [http://localhost:8080/editor.html](http://localhost:8080/editor.html) to launch the page builder.

---

## Project Structure

```
WebCraft-Builder/
├── editor.html          # Main drag-and-drop builder interface
├── save.js              # Express backend server (File save, media scan & upload endpoints)
├── package.json         # Project metadata and dependencies
├── libs/
│   ├── builder/         # Builder core engines (builder.js, inputs.js, undo.js, components)
│   └── autocomplete/    # Autocomplete plugin utilities
├── demo/                # Sample website templates (landing, blog, album, pricing)
├── media/               # Uploaded images and media gallery assets
├── css/                 # Editor UI stylesheets
└── js/                  # Helper libraries & icons
```

---

## API & Backend Routes

The project runs a Node.js Express server ([save.js](save.js)) supporting the following API endpoints:

- `POST /save.php`: Saves edited HTML files directly to disk, creating required target subdirectories automatically.
- `POST /scan.php`: Recursively scans the `media/` directory and returns a JSON folder structure for the media manager modal.
- `POST /upload.php`: Accepts image uploads via `multer` and saves them to designated media folders.

---

## License

This project is open-source under the [Apache 2.0 License](LICENSE).
