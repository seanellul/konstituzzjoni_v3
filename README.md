# Kostituzzjoni.mt - Malta Constitution Interactive Reader

An interactive web application for exploring and understanding the Constitution of Malta.

## Features

- Browse the Constitution by chapters and articles
- Search for specific content within the Constitution
- View amendment history and cross-references
- Modern, responsive design for all devices
- Accessible interface following web accessibility standards

## Technology Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Authentication**: NextAuth.js (optional)
- **SEO**: Next SEO

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/konstituzzjoni-mt.git
   cd konstituzzjoni-mt
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/articles` - JSON files containing the Constitution data
- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and data fetching logic
- `/src/types` - TypeScript type definitions
- `/src/styles` - Global styles and Tailwind configuration
- `/public` - Static assets

## Data Structure

The Constitution data is organized as follows:

- Each chapter is stored in a separate directory (`chapter_1`, `chapter_2`, etc.)
- Each article is stored as a JSON file within its chapter directory
- The schema for the Constitution is defined in `maltese_constitution_schema.json`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The Government of Malta for providing the official text of the Constitution
- All contributors who have helped to make this project possible 