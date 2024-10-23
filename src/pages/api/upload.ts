import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import axios from 'axios';
import {IncomingForm} from 'formidable';
import fs from 'fs';
import { Buffer } from "buffer";
import { NextApiRequest, NextApiResponse } from "next";
// This is required to allow formidable to parse the request body
export const config = {
    api: {
        bodyParser: false, // Disabling the default body parser
        runtime: "edge",   // Use edge runtime
    },
};

export default async function handler(req:NextApiRequest,res:NextApiResponse) {
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }
    const fData = await new Promise<{ fields: any, files: any }>((resolve, reject) => {
      const form = new IncomingForm({
          multiples: false
      })
      form.parse(req, (err, fields, files) => {
          if (err) return reject(err)
          resolve({ fields, files })
      })
  });

  // const imageFile = fData.files.imageFile
  //   const tempImagePath = imageFile?.filepath
  const file = fData.files.file[0];

try{
             
                const buffer = await fs.promises.readFile(file.filepath);
                const filename = file.originalFilename.replaceAll(" ", "_");

                // Ensure the public/assets directory exists
                const dir = path.join(process.cwd(), "public/assets");
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                // Write the file to the server
                await writeFile(
                    path.join(dir, filename),
                    buffer
                );

                // Prepare for sending to the external API
                const formDataToSend = new FormData();
                       // Create a Blob-like object
       const blob = new Blob([buffer], { type: file.mimetype });

       formDataToSend.append("file", blob, filename);
       const response = await axios.post(`${process.env.API}/upload`, formDataToSend, {
                        headers: {
                            'Content-Type': `multipart/form-data; `,
                        }
                    });
console.log(response)    
                    res.status(200).send(response.data);
}
catch (error) {
              console.error('Error uploading to API:', error);
              return (NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
          }

    // const form = new IncomingForm();

    // return new Promise((resolve, reject) => {
    //     form.parse(req, async (err, fields, files) => {
    //         if (err) {
    //             return reject(NextResponse.json({ error: "Error parsing files." }, { status: 400 }));
    //         }

    //         const file = files.file;
    //         if (!file) {
    //             return resolve(NextResponse.json({ error: "No files received." }, { status: 400 }));
    //         }

    //         console.log('Received file:', file);

    //         try {
    //             // Read the file
    //             const buffer = await fs.promises.readFile(file.filepath);
    //             const filename = file.originalFilename.replaceAll(" ", "_");

    //             // Ensure the public/assets directory exists
    //             const dir = path.join(process.cwd(), "public/assets");
    //             if (!fs.existsSync(dir)) {
    //                 fs.mkdirSync(dir, { recursive: true });
    //             }

    //             // Write the file to the server
    //             await writeFile(
    //                 path.join(dir, filename),
    //                 buffer
    //             );

    //             // Prepare for sending to the external API
    //             const formDataToSend = new FormData();
    //                    // Create a Blob-like object
    //    const blob = new Blob([buffer], { type: file.mimetype });

    //    formDataToSend.append("file", blob, filename);
               

    //             const response = await axios.post(`${process.env.API}/upload`, formDataToSend, {
    //                 headers: {
    //                     'Content-Type': `multipart/form-data; `,
    //                 }
    //             });

    //             return resolve(NextResponse.json({ response: response.data }));
    //         } catch (error) {
    //             console.error('Error uploading to API:', error);
    //             return reject(NextResponse.json({ message: 'Internal server error' }, { status: 500 }));
    //         }
    //     });
    // });
}
