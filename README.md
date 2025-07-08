# db_mapping

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Production Build

Generate a production build:

```bash
npm run build
```

## Docker

The application can be containerized using the provided `Dockerfile`.

Build the image:

```bash
docker build -t db_mapping .
```

Run the container, exposing the app on port 8080:

```bash
docker run -p 8080:80 db_mapping
```

Then navigate to `http://localhost:8080` in your browser.
