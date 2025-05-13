# SOLENA - Global Medical Device Consulting Website

This repository contains the SOLENA multilingual website for medical device consulting services.

## Site Structure

The website is structured as follows:

- Root directory: English version
- `/ko/`: Korean version
- `/ja/`: Japanese version
- `/de/`: German version
- `/css/`: Stylesheets
- `/js/`: JavaScript files
- `/images/`: Images and graphics
- `/templates/`: Component templates for site maintenance

## Template System

To maintain consistency across the multilingual site, we use a template system. This allows updating common elements like the navigation, language selector, and logo across all pages with a single change.

### Available Templates

- `templates/language-dropdown-*.html`: Language dropdown for each language
- `templates/logo.html`: Logo template
- `templates/nav-*.html`: Navigation menu for each language

### Updating Templates

When you need to make a change that should apply to all pages (e.g., adding a new menu item):

1. Edit the appropriate template file in the `/templates/` directory
2. Run the template updater script:

```
python update_templates.py
```

This will update all HTML files with the changes from the templates.

## Making Changes

### To update text content:

Edit the HTML files directly for language-specific content changes.

### To update common elements across all pages:

1. Edit the template file
2. Run the template updater

### To add a new page:

1. Create the page in English
2. Copy it to each language folder
3. Translate the content
4. Run the template updater to ensure consistent elements

## Translation Management

To manage translations effectively:

1. Make changes to the English version first
2. Use the English version as the source for translations
3. Apply translations to the respective language versions
4. Verify that all language versions have the same structure and features

## Development Server

To run a local development server:

```
python -m http.server
```

Then visit http://localhost:8000 in your browser.

## Troubleshooting

If you encounter issues with the template updater:

- Make sure all HTML files are closed in your editor
- Check that no web server is currently accessing the files
- Verify that all template files exist and are correctly formatted

## Maintenance Tips

1. Always keep a backup before making major changes
2. Test all language versions after updates
3. Check mobile responsiveness for all changes
4. Verify that all links work correctly
5. Keep JavaScript functionality consistent across all pages
6. Update all versions when adding new features

## Features

- Responsive design using Bootstrap 5
- Modern and clean user interface
- Mobile-friendly layout
- Contact form with validation
- Smooth scrolling and animations
- Cross-browser compatible

## Pages

1. **Home** - Main landing page with hero section and service highlights
2. **About Us** - Company information, mission, and vision
3. **Services** - Detailed service offerings
4. **Contact** - Contact form and information

## Project Structure

```
solena-medical/
├── index.html          # Home page
├── about.html          # About Us page
├── services.html       # Services page
├── contact.html        # Contact page
├── css/
│   └── style.css      # Custom styles
├── js/
│   └── main.js        # Custom JavaScript
└── images/            # Image assets
```

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Open the project in your preferred code editor.

3. To view the website locally, you can use any of these methods:
   - Open `index.html` directly in your browser
   - Use a local development server (recommended)
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

4. Access the website at `http://localhost:8000` (or the port specified by your server)

## Dependencies

- Bootstrap 5.3.0
- Font Awesome 6.0.0
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Customization

1. **Colors**: Edit the CSS variables in `css/style.css` to change the color scheme
2. **Content**: Update the HTML files to modify text and images
3. **Images**: Replace placeholder images in the `images` directory
4. **Contact Form**: Update the form handling in `js/main.js` to connect with your backend

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or concerns, please contact:
- Email: info@solena-medical.com
- Phone: +1 (234) 567-890 