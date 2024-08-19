
const { BlobServiceClient, BlobSASPermissions, SASProtocol, generateBlobSASQueryParameters } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.CONNECTION_STRING;
const CONTAINER_NAME = process.env.CONTAINER_NAME; // Your container name

exports.AzureBlob = async (data, fileName) => {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

        // Create the container if it doesn't exist
        await containerClient.createIfNotExists();

        const blobClient = containerClient.getBlockBlobClient(fileName);

        // Upload the data
        const uploadBlobResponse = await blobClient.upload(data, Buffer.byteLength(data));  // Use uploadData for string or buffer
        console.log("Upload complete", uploadBlobResponse.requestId);

        // Generate the SAS URL for the uploaded blob
        const sasToken = generateBlobSAS(blobClient);
        const blobUrlWithSAS = `${blobClient.url}?${sasToken}`;

        return blobUrlWithSAS; // Return the URL with SAS token
    } catch (err) {
        console.error("Error uploading to Azure Blob Storage:", err);
        throw err; // Rethrow the error after logging it
    }
}

function generateBlobSAS(blobClient) {
    const sasOptions = {
        containerName: blobClient._containerName,
        blobName: blobClient._name,
        permissions: BlobSASPermissions.parse("r"), // "r" for read-only SAS token
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expires in 1 hour
        protocol: SASProtocol.HttpsAndHttp, // Allow both HTTPS and HTTP
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, blobClient.credential).toString();
    return sasToken;
}
