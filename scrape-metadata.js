const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// List of URLs to scrape metadata from
const urls = [
    'https://www.wordexperts.com.au/',
    'https://www.wordexperts.com.au/contact-us/request-a-quote/',
    'https://www.wordexperts.com.au/excel-and-access-experts-sydney/',
    'https://www.wordexperts.com.au/training/',
    'https://www.wordexperts.com.au/custom-toolbars-and-ribbons/',
    'https://www.wordexperts.com.au/word-template-conversions/',
    'https://www.wordexperts.com.au/upgrades-and-migration/',
    'https://www.wordexperts.com.au/fill-in-forms/',
    'https://www.wordexperts.com.au/popup-forms/',
    'https://www.wordexperts.com.au/quick-parts/',
    'https://www.wordexperts.com.au/remove-repetition-and-increase-productivity/',
    'https://www.wordexperts.com.au/government-departments/',
    'https://www.wordexperts.com.au/corporate-identity/',
    'https://www.wordexperts.com.au/corporate-global-template-solution/',
    'https://www.wordexperts.com.au/contact-us/',
    'https://www.wordexperts.com.au/client-testimonials/',
    'https://www.wordexperts.com.au/meet-the-team/',
    'https://www.wordexperts.com.au/accessibility/',
    'https://www.wordexperts.com.au/word-document-template-creation/',
    'https://www.wordexperts.com.au/companies-and-organisations/',
];

// Function to fetch and scrape metadata
async function fetchMetadata(url) {
    try {
        // Make a request to the URL
        const { data } = await axios.get(url);

        // Load the HTML into cheerio
        const $ = cheerio.load(data);

        // Extract title
        const title = $('title').text() || 'No title';

        // Extract meta description
        const description = $('meta[name="description"]').attr('content') || 'No description';

        // Extract Open Graph title
        const ogTitle = $('meta[property="og:title"]').attr('content') || 'No OG title';

        // Extract Open Graph description
        const ogDescription = $('meta[property="og:description"]').attr('content') || 'No OG description';

        // Extract canonical URL if present
        const canonical = $('link[rel="canonical"]').attr('href') || 'No canonical URL';

        // Extract schema JSON-LD if present
        const schema = $('script[type="application/ld+json"]').html() || null;

        // Return extracted metadata
        return {
            url,
            title,
            description,
            ogTitle,
            ogDescription,
            canonical,
            ogImage: $('meta[property="og:image"]').attr('content') || null,
            ogUrl: $('meta[property="og:url"]').attr('content') || null,
            ogType: $('meta[property="og:type"]').attr('content') || null,
            twitterCard: $('meta[name="twitter:card"]').attr('content') || null,
            twitterTitle: $('meta[name="twitter:title"]').attr('content') || null,
            twitterDescription: $('meta[name="twitter:description"]').attr('content') || null,
            twitterImage: $('meta[name="twitter:image"]').attr('content') || null,
            robots: $('meta[name="robots"]').attr('content') || null,
            viewport: $('meta[name="viewport"]').attr('content') || null,
            charset: $('meta[charset]').attr('charset') || null,
            favicon: $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || null,
            schema,
        };
    } catch (error) {
        console.error(`Failed to fetch metadata for ${url}:`, error.message);
        return null;
    }
}

// Function to save schema JSON to a file
function saveSchemaToFile(url, schema) {
    if (!schema) return; // Do nothing if no schema is present

    // Parse and format the schema
    const parsedSchema = JSON.parse(schema);
    const prettySchema = JSON.stringify(parsedSchema, null, 2);

    // Create a filename based on the URL
    const fileName = url
        .replace(/https?:\/\//, '')   // Remove the protocol
        .replace(/[\/:]/g, '-')        // Replace slashes and colons with dashes
        .concat('-schema.json');       // Add the -schema.json extension

    // Define the output path (current directory)
    const outputPath = path.join(__dirname, fileName);

    // Write the schema to a file
    fs.writeFile(outputPath, prettySchema, (err) => {
        if (err) {
            console.error(`Error writing to file ${fileName}:`, err);
        } else {
            console.log(`Schema saved to ${outputPath}`);
        }
    });
}

// Main function to scrape metadata for all URLs
async function scrapeAllMetadata() {
    const metadataList = [];

    for (const url of urls) {
        const metadata = await fetchMetadata(url);
        if (metadata) {
            metadataList.push(metadata);
            saveSchemaToFile(url, metadata.schema); // Save the schema for each URL
        }
    }

    // Save the metadata to a JSON file
    fs.writeFileSync('metadata.json', JSON.stringify(metadataList, null, 2));
    console.log('Metadata saved to metadata.json');
}

// Run the scraper
scrapeAllMetadata();
