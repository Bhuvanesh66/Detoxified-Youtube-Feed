# Detoxified YouTube Feed

## Overview
A web-based project designed to enhance focus by reducing distractions on YouTube. This project provides a minimalistic interface, hiding unnecessary recommendations and distractions such as the sidebar, comments, and trending sections, allowing users to watch only the content they choose.

---

## Features

- **Minimal Interface**: Hides unnecessary YouTube elements like comments, related videos, and recommendations.
- **Focus Mode**: Enables users to watch videos distraction-free.
- **Customizable Filters**: Users can toggle visibility for specific YouTube elements such as the sidebar or comments.
- **Lightweight and Fast**: Simple design with minimal overhead to ensure smooth browsing.
  
---

## Technologies Used

- **HTML**: For structuring the web interface.
- **CSS**: For styling the interface to ensure a clean and distraction-free experience.
- **JavaScript**: For adding interactivity, hiding/unhiding YouTube elements , Event listeners(DOM manupilation) as fronted works and for the Backend works like validating youtube key, initialising the key and search endpoint.
  
---

## How It Works

1. **Loading the Page**: Once the user opens YouTube through this project, it injects custom CSS and JavaScript to hide distracting elements.
2. **Toggle Options**: Users can enable or disable specific sections such as:
   - Dark and Light mode
3. **Focus Mode**: When enabled, the project only displays the main video player.

---


## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend API**: Google Gemini API for news and sentiment analysis
- **Libraries Used**: None (Vanilla JS implementation)

---

## Setup Instructions

### Prerequisites

- A modern web browser (Google Chrome, Firefox, etc.)
- A valid Google API key with access to the Gemini model

## Installation and Usage

### Method 1: Open as a Web App
1. Clone the repository:
   ```bash
   git clone https://github.com/Bhuvanesh66/Detoxified-Youtube-Feed

   ```
2. Navigate to the project directory:
   ```bash
   cd Web app
   ```
3. Run the server:
   ```bash
   node server.js
   ```
4. Open `public\index.html` file in your preferred web browser.

### Configuration

1. Replace the placeholder API key in the .env with your Google API key before you run your server.js file:
   ```javascript
    API_KEY = 'YOUR_API_KEY_HERE';
    PORT = 3000
   ```
2. Save the changes and refresh the browser.

---

## Usage
If you want to be productive while using YouTube and want to skip unwanted recommendation which are apart from your search this try using my web app
---

## Project Structure

```
project-directory/
|-public
  |-- index.html         # Main HTML file
  |-- search.html        # Additionaly and required HTML file
  |-- styles.css         # Embedded CSS in the HTML file
  |-- script.js          # Embedded JavaScript in the HTML file
|-server.js
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

---

## Acknowledgements

- YouTube API for enabling the core functionality of this project.


---

## Contact

For queries or feedback, please contact deepak.24bcs10067\@sst.scaler.com.
