"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { FaImage } from "react-icons/fa";
import { useState } from "react";
import { ClientUploadedFileData } from "uploadthing/types";
import prettyBytes from 'pretty-bytes';
import { Label } from "@/components/ui/label";

// Uploadthing image upload field
export default function Utform({ existingPath }: { existingPath?: string }) {
  const [images, setImages] = useState<ClientUploadedFileData<{ uploadedBy: string }>[]>([]);
  const [imageKey, setImageKey] = useState("")
  const [prevPath, setPrevPath] = useState("")
  return (
    <Label htmlFor="imageKey">
      Product Image
      <input type="hidden" name="imageKey" id="imageKey" value={imageKey} />
      <input type="hidden" name="prevPath" value={prevPath} />
      <div>
        <UploadDropzone
          endpoint="imageUploader"
          className="cursor-pointer ut-label:text-black"
          onClientUploadComplete={(res) => {
            setImages(res);
            setImageKey(res[0].key) // TODO can allow for more image uploads, can also store key 
            if (existingPath) setPrevPath(existingPath); // overwrite existing path
          }}
          onUploadError={error => alert(`ERROR! ${error.message}`)}
        />
        <div className="mt-2 grid gap-2 ">
          {images.map(image => (
            <a href={image.url} target="_blank" key={image.key}>
              <div className="flex items-center justify-between cursor-pointer bg-gray-100 p-4 rounded-lg ">
                <div className="flex items-center gap-2">
                  <FaImage />
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{image.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{prettyBytes(image.size)}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Label>
  );
}