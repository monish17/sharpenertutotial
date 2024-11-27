require('dotenv').config();

const { BlobServiceClient } = require("@azure/storage-blob");



const { Op } = require('sequelize');


const MessageDatabase=require('../Models/MessageStoring');

const ArchieveMessages=require('../Models/ArchieveMessageStoring');


exports.MessageStoring=async(req,res,next)=>{
    console.log("request arrived in Message_Storing");
    // console.log(req.body);
    const MESSAGE_CONTENT=req.body.Message;
    const USER_NAME=req.body.userName;
    const USER_ID = req.user.dataValues.ID;
    const GROUP_ID=req.body.GROUP_ID;
    // console.log(MESSAGE_CONTENT,USER_ID,USER_NAME);
    try{
        await MessageDatabase.create({ USER_ID,USER_NAME, MESSAGE_CONTENT,GROUP_ID});
        res.status(200).json({ Message: MESSAGE_CONTENT});
    }catch(err){
        console.log(err);
        res.status(400).json({Message:'Server Error'});
    }
}

exports.RetrievingMessage=async(req,res,next)=>{
    console.log("request arrived in Message_Retrieving");
    let lastMessageId=req.params.lastMessageId;
    let Group_Id=req.params.Group_Id;
    const blobRegexURL = /https:\/\/chatappfilestorage\.blob\.core\.windows\.net\/[\w-]+\/[\w.%()-]+/g;    // storing  AZURE domain and path structure
    const connectionString = process.env.AZURE_FILESTORAGE_CONNECTIONSTRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    try{
        const retrievedMessage=await MessageDatabase.findAll({
            where: {
                id: { 
                    [Op.gt]: lastMessageId
                },
                GROUP_ID:Group_Id
            },
            limit:10,
            order:[['createdAt','DESC']]
        }
        )
        console.log('retrievedMessages>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',retrievedMessage);
        for (const message of retrievedMessage.reverse()) {
            const content=message.MESSAGE_CONTENT;
            console.log('content????????????????????',content)
            const urls = content.match(blobRegexURL);
            console.log('url??????????????????????????',urls);
            if(urls){
                for (const url of urls) {
                    console.log(url);
                    try {
                        const blobUrl = new URL(url);
                        const rawPathname=blobUrl.pathname;
                        const decodedPathname = decodeURIComponent(rawPathname);
                        const containerName =decodedPathname.split('/')[1]; // Extract container name
                        const blobName = decodedPathname.split('/').slice(2).join('/'); // Extract blob name
                        const containerClient = blobServiceClient.getContainerClient(containerName);
                        const blobClient = containerClient.getBlobClient(blobName);
                        const fileName = blobName.split('/').pop(); 
                        console.log("Decoded Pathname:?????????????????????????????????????", decodedPathname);
                        console.log("Pathname:?????????????????????????????????????", rawPathname);


                        console.log('????????????????????????????????????????????????????????????',containerName,blobName,containerClient,blobClient);

                        const properties = await blobClient.getProperties();
                        const mimeType = properties.contentType; // MIME type of the blob
                        // console.log('MIME Type:', mimeType);

                        const expiresOn = new Date();
                        expiresOn.setMinutes(expiresOn.getMinutes() + 60); // 1 hour expiry
                        const sasToken =  await blobClient.generateSasUrl({
                        permissions: 'r', // Read permission
                        expiresOn: expiresOn,
                        });

                        const sasUrl = `${url}?${sasToken.split('?')[1]}`;  // Only append the SAS query part to avoid duplication

                        console.log('SAS URL:', sasUrl);
                        const encodedUrl = encodeURIComponent(sasUrl);
                        message.MESSAGE_CONTENT = sasUrl;
                        message.dataValues.fileType=mimeType;
                        message.dataValues.fileName=fileName;
                        console.log(message);     
                                                
                    } catch (err) {
                        console.log(`Error fetching file from URL ${url}:`, err.message);
                        fileData.push({ url, fileContent: null });
                    }
                }
            

            }

        }
        // console.log('fileData<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<',fileData);
        res.status(200).json({ Message: retrievedMessage});
    }catch(err){
        console.log(err);
        res.status(400).json({Message:'Server Error'});
    }
}

exports.GetOlderMessage= async(req,res,next)=>{
    console.log('Request Arrived in GetOldermessage controller');
    let firstMessageId=req.params.firstMessageId;
    let Group_Id=req.params.Group_Id;
    const blobRegexURL = /https:\/\/chatappfilestorage\.blob\.core\.windows\.net\/[\w-]+\/[\w.%()-]+/g;    // storing  AZURE domain and path structure
    const connectionString = process.env.AZURE_FILESTORAGE_CONNECTIONSTRING; 
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    try{
        const retrievedMessage=await MessageDatabase.findAll({
            where: {
                id: { 
                    [Op.lt]: firstMessageId
                },
                GROUP_ID:Group_Id
            },
            limit:10,
            order:[['createdAt','DESC']]
        }
        )
        console.log('retrieved Messages??????????????',retrievedMessage);
        for (const message of retrievedMessage.reverse()) {
            const content=message.MESSAGE_CONTENT;
            // console.log('content????????????????????',content)
            const urls = content.match(blobRegexURL);
            // console.log('url??????????????????????????',urls);
            if(urls){
                for (const url of urls) {
                    // console.log(url);
                    try {
                        const blobUrl = new URL(url);
                        const rawPathname=blobUrl.pathname;
                        const decodedPathname = decodeURIComponent(rawPathname);
                        const containerName =decodedPathname.split('/')[1]; 
                        const blobName = decodedPathname.split('/').slice(2).join('/'); 
                        const containerClient = blobServiceClient.getContainerClient(containerName);
                        const blobClient = containerClient.getBlobClient(blobName);
                        const fileName = blobName.split('/').pop(); 
                        console.log('fileName>>>>>>>>>>>>>>>>>>>>>>?????????',fileName);
                        // console.log("Decoded Pathname:?????????????????????????????????????", decodedPathname);
                        // console.log("Pathname:?????????????????????????????????????", rawPathname);


                        // console.log('????????????????????????????????????????????????????????????',containerName,blobName,containerClient,blobClient);

                        const properties = await blobClient.getProperties();
                        const mimeType = properties.contentType; // MIME type of the blob
                        // console.log('MIME Type:', mimeType);

                        const expiresOn = new Date();
                        expiresOn.setMinutes(expiresOn.getMinutes() + 60); // 1 hour expiry
                        const sasToken =  await blobClient.generateSasUrl({
                        permissions: 'r', // Read permission
                        expiresOn: expiresOn,
                        });

                        const sasUrl = `${url}?${sasToken.split('?')[1]}`;  // Only append the SAS query part to avoid duplication

                        // console.log('SAS URL:', sasUrl);
                        const encodedUrl = encodeURIComponent(sasUrl);
                        message.MESSAGE_CONTENT = sasUrl;
                        message.dataValues.fileType=mimeType;
                        message.dataValues.fileName=fileName;
                        // console.log(message);     
                                                
                    } catch (err) {
                        console.log(`Error fetching file from URL ${url}:`, err.message);
                        fileData.push({ url, fileContent: null });
                    }
                }
            

            }

        }
        res.status(200).json({ Message: retrievedMessage.reverse()});
    }catch(err){
        console.log(err);
        res.status(400).json({Message:'Server Error'});
    }
}

exports.DynamicMessageRetriving=async(req,res,next)=>{
    console.log("request arrived in Dynamic Message Retrieving");
    let Group_Id=req.params.GROUP_ID;
    // console.log(Group_Id);
    try{
        const retrievedMessage=await MessageDatabase.findAll({
            where: {
               GROUP_ID:Group_Id
            }
        }
        )
        res.status(200).json({ Message: retrievedMessage});
    }catch(err){
        console.log(err);
        res.status(400).json({Message:'Server Error'});
    }
}

exports.PostingFiles=async(req,res,next)=>{
    console.log('Request Arrived in PostingFiles');
    console.log(req.file);
    console.log(req.params.Group_Id,req.params.userName)
    // const fileNames=req.file.originalname;
    const fileName=`${Date.now()}-${req.file.originalname}`;
    console.log('fileName????????????????>>>>>>>>>>>>>>>>>>>>',req.file.originalname)
    const mimeType= req.file.mimetype;
    console.log(mimeType);
    const fileBuffer= req.file.buffer;
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_FILESTORAGE_CONNECTIONSTRING;
    const CONTAINER_NAME = "chatappfilestorage";
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);

        // Upload the file
        const uploadBlobResponse = await blockBlobClient.uploadData(fileBuffer, {
            blobHTTPHeaders: { blobContentType: mimeType },
        });
        const fileUrl = blockBlobClient.url; // Get the file URL
        const expiresOn = new Date();
        expiresOn.setMinutes(expiresOn.getMinutes() + 60); // 1 hour expiry
        const { generateBlobSASQueryParameters, BlobSASPermissions } = require("@azure/storage-blob");

        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: CONTAINER_NAME,
                blobName: fileName,
                permissions: BlobSASPermissions.parse("r"), // Read permission
                expiresOn,
            },
            blobServiceClient.credential
        ).toString();

        const sasUrl = `${fileUrl}?${sasToken}`;

        console.log(sasUrl);
        if(fileUrl){
            const MESSAGE_CONTENT=fileUrl;
            const GROUP_ID=req.params.Group_Id;
            const USER_NAME=req.params.userName;
            const USER_ID = req.user.dataValues.ID;
            try{
                await MessageDatabase.create({ USER_ID,USER_NAME, MESSAGE_CONTENT,GROUP_ID});
                res.status(200).json({ userName:USER_NAME, Message: sasUrl,GROUP_ID:GROUP_ID,fileType:mimeType,fileName:req.file.originalname});
            }catch(err){
                console.log(err);
                res.status(400).json({Message:'Server Error'});
            }
        }
        // res.status(201).json({ message: "File uploaded successfully", fileUrl });
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "File upload failed", error: err.message });
    }
}


exports.backupData=async(req,res,next)=>{
    console.log('Request Arrived in backUpData Controller');
    try {
        const startOfYesterday = new Date();
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);

        const endOfYesterday = new Date();
        endOfYesterday.setDate(endOfYesterday.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);

        const messages = await MessageDatabase.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startOfYesterday, endOfYesterday]
                }
            }
        });

        // 3. Insert fetched messages into the Archieve-Messages table
        const archiveData = messages.map(message => ({
            USER_ID: message.USER_ID,
            USER_NAME: message.USER_NAME,
            MESSAGE_CONTENT: message.MESSAGE_CONTENT,
            GROUP_ID: message.GROUP_ID,
            createdAt:message. createdAt
        }));

        await ArchieveMessages.bulkCreate(archiveData);
        await MessageDatabase.destroy({
            where: {
                createdAt: {
                    [Op.between]: [startOfYesterday, endOfYesterday]
                }
            }
        });

        res.status(200).json({ message: "Backup completed successfully" });
    }catch(err){
        console.log(err);
    }

}

exports.GetArchievedMessages=async(req,res,next)=>{
    console.log('Request Arrived in Archieved Messages Controller ');
    let firstMessageId=req.params.firstMessageId;
    console.log(firstMessageId);
    let Group_Id=req.params.Group_Id;
    const blobRegexURL = /https:\/\/chatappfilestorage\.blob\.core\.windows\.net\/[\w-]+\/[\w.%()-]+/g;    // storing  AZURE domain and path structure
    const connectionString = process.env.AZURE_FILESTORAGE_CONNECTIONSTRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    try{
        const retrievedMessage=await ArchieveMessages.findAll({
            where: {
                id: { 
                    [Op.lt]: firstMessageId
                },
                GROUP_ID:Group_Id
            },
            limit:10,
            order:[['createdAt','DESC']]
        }
        )
        console.log('retrieved Messages??????????????',retrievedMessage);
        for (const message of retrievedMessage.reverse()) {
            const content=message.MESSAGE_CONTENT;
            // console.log('content????????????????????',content)
            const urls = content.match(blobRegexURL);
            // console.log('url??????????????????????????',urls);
            if(urls){
                for (const url of urls) {
                    // console.log(url);
                    try {
                        const blobUrl = new URL(url);
                        const rawPathname=blobUrl.pathname;
                        const decodedPathname = decodeURIComponent(rawPathname);
                        const containerName =decodedPathname.split('/')[1]; 
                        const blobName = decodedPathname.split('/').slice(2).join('/'); 
                        const containerClient = blobServiceClient.getContainerClient(containerName);
                        const blobClient = containerClient.getBlobClient(blobName);
                        const fileName = blobName.split('/').pop(); 
                        console.log('fileName>>>>>>>>>>>>>>>>>>>>>>?????????',fileName);
                        // console.log("Decoded Pathname:?????????????????????????????????????", decodedPathname);
                        // console.log("Pathname:?????????????????????????????????????", rawPathname);


                        // console.log('????????????????????????????????????????????????????????????',containerName,blobName,containerClient,blobClient);

                        const properties = await blobClient.getProperties();
                        const mimeType = properties.contentType; // MIME type of the blob
                        // console.log('MIME Type:', mimeType);

                        const expiresOn = new Date();
                        expiresOn.setMinutes(expiresOn.getMinutes() + 60); // 1 hour expiry
                        const sasToken =  await blobClient.generateSasUrl({
                        permissions: 'r', // Read permission
                        expiresOn: expiresOn,
                        });

                        const sasUrl = `${url}?${sasToken.split('?')[1]}`;  // Only append the SAS query part to avoid duplication

                        // console.log('SAS URL:', sasUrl);
                        const encodedUrl = encodeURIComponent(sasUrl);
                        message.MESSAGE_CONTENT = sasUrl;
                        message.dataValues.fileType=mimeType;
                        message.dataValues.fileName=fileName;
                        // console.log(message);     
                                                
                    } catch (err) {
                        console.log(`Error fetching file from URL ${url}:`, err.message);
                    }
                }
            

            }

        }
        res.status(200).json({ Message: retrievedMessage});
    }catch(err){
        console.log(err);
        res.status(400).json({Message:'Server Error'});
    }
}