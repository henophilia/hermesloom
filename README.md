# German Foundations Funding Finder

This project is a web application designed to help users find relevant German foundations for their projects. It leverages advanced natural language processing and vector search technologies to match project descriptions with foundation purposes.

## Features

1. **Project Description Transformation**: Users can input their project description in any language. The system then transforms this into a German foundation purpose using OpenAI's GPT model.

2. **Foundation Search**: Based on the transformed purpose, the system searches for relevant foundations using vector similarity search in Pinecone.

3. **Multilingual Support**: The project description can be in any language, making it accessible to international users.

4. **Detailed Foundation Information**: For each matching foundation, the system provides comprehensive details including:
   - Basic information (name, purpose, internal ID, etc.)
   - Contact information (address, phone, email, website)
   - Additional content related to the foundation

5. **Translation Feature**: Users can translate foundation purposes to their preferred language.

6. **Performance Metrics**: The system displays search execution time and the total number of foundations in the database.

## Technology Stack

- **Frontend**: Next.js with React
- **Backend**: Next.js API routes
- **Database**: MongoDB for storing foundation details
- **Vector Search**: Pinecone for efficient similarity search
- **NLP**: OpenAI's GPT models for text transformation and embeddings
- **UI Components**: Ant Design

## How It Works

1. The user enters a project description.
2. The system transforms this description into a German foundation purpose.
3. The transformed purpose is converted into a vector embedding.
4. Pinecone searches for similar vectors in its index.
5. Matching foundation details are retrieved from MongoDB.
6. Results are displayed to the user in a table format with options for detailed view and translation.

## Setup and Deployment

This project is deployed using Vercel and requires the following environment variables:

- `OPENAI_API_KEY`: For accessing OpenAI's GPT models
- `PINECONE_API_KEY`: For vector similarity search
- `MONGODB_URI`: For connecting to the MongoDB database
- `GA_MEASUREMENT_ID`: For Google Analytics tracking (optional)

## Contributing

Contributions to this project are welcome.

## License

MIT

## Disclaimer

This readme and most of this project's code was written using claude-3.5-sonnet within [Cursor](https://www.cursor.com/).
