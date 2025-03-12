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

## Security and Privacy

### Analytics Privacy

This project collects anonymous usage statistics to help improve the user experience:

- **No Personal Information**: We do not collect IP addresses, names, emails, or any personally identifiable information.
- **Session Privacy**: Session IDs are randomly generated and automatically rotated every 24 hours.
- **Data Retention**: All analytics data is automatically deleted after 365 days.
- **User Control**: Users can opt out of analytics at any time through the privacy notice.

### Security Measures

To protect both users and the application:

- **Database Security**: Prisma Studio (port 5555) is only accessible in development mode, never in production.
- **Environment Separation**: Different security settings are applied based on the environment (development vs. production).
- **Session Protection**: User sessions are generated with cryptographically secure random values.

### Development Security

When developing:

- Always use the `npm run studio:dev` command to run Prisma Studio safely.
- Never expose the Prisma Studio interface in production environments.
- Copy `.env.example` to `.env` and set secure values for your environment.

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

3. Copy `.env.example` to `.env` and configure settings:
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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

## Production Deployment

1. Build the application with `npm run build`
2. Set NODE_ENV to "production" in your environment
3. Set secure values for all environment variables
4. Run `npm start` to start the production server
5. Ensure firewall rules block access to port 5555 