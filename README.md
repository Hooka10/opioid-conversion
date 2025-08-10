# Opioid Conversion Web App

This web application converts oral opioid doses to injectable opioid doses by sending user input to a Dify workflow via a secure backend.

## Project Structure

- `index.html`: The main frontend page with the user input form.
- `style.css`: Styles for the application.
- `script.js`: Client-side logic to handle form submission, call the backend, and display results.
- `server.js`: A Node.js Express backend that securely forwards requests to the Dify API.
- `package.json`: Defines project dependencies and scripts.
- `.gitignore`: Specifies files to be ignored by Git.

## How to Run Locally

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Server:**
    ```bash
    node server.js
    ```

3.  Open your web browser and navigate to `http://localhost:3000`.

## Deployment to Render

1.  **Push to GitHub:**
    Create a new repository on GitHub and push the code.

2.  **Create a New Web Service on Render:**
    - Connect your GitHub account to Render.
    - Select the repository.
    - Render will automatically detect that it's a Node.js application.
    - **Build Command:** `npm install`
    - **Start Command:** `node server.js`

Render will build and deploy the application. The Dify API key is included in the `server.js` file. For better security in a production environment, consider using Render's environment variables to store the API key.
