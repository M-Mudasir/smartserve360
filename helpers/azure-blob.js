const { BlobServiceClient } = require("@azure/storage-blob");
require("dotenv").config();
const path = require("path");

const connectionString = process.env.AZURE_BLOB_CONNECTION_STRING;
const containerName = process.env.AZURE_BLOB_CONTAINER;

async function uploadFileToBlobStorage(fileBuffer, blobName) {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const options = {
            blobHTTPHeaders: {
                blobContentType: "image/png",
                blobContentDisposition: "inline"
            }
        };
        // Upload the file buffer to Azure Blob Storage
        await blockBlobClient.uploadData(fileBuffer, options);

        const blobUrl = blockBlobClient.url;
        return blobUrl;
    } catch (error) {
        console.error(`Error uploading file "${blobName}" to blob storage:`, error);
        return null;
    }
}

module.exports = { uploadFileToBlobStorage };
