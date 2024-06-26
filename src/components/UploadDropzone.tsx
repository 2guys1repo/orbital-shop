"use client"
import { cn } from "@/lib/utils"
import { CircleX, Image, Loader2, MousePointerSquareDashed, TriangleAlert } from "lucide-react"
import { useState, useTransition } from "react"
import Dropzone, { FileRejection } from "react-dropzone"
import { Progress } from "./ui/progress"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "./ui/use-toast"
import { FaImage } from "react-icons/fa"
import prettyBytes from "pretty-bytes"
import { Button } from "./ui/button"
import { deleteImage } from "@/app/_actions/uploadthing"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
type uploadedImage = {
  name: string,
  size: number,
  url: string,
  key: string,
}

export default function UploadDropzone() {
  // TODO delete image on reload

  // useEffect(() => {
  //   const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //     e.preventDefault();
  //     if (uploadedImage) {
  //       (async () => {
  //         console.log(await handleDeleteImage(null, uploadedImage.key));
  //       })();
  //     }
  //     return (e.returnValue = '')
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, []);
  const { toast } = useToast()
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isPending, startTransition] = useTransition()
  const [uploadedImage, setUploadedImage] = useState<uploadedImage | null>(null)
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: ([data]) => {
      setUploadedImage({
        name: data.name,
        size: data.size,
        url: data.url,
        key: data.key,
      })
    },
    onUploadProgress(p) {
      setUploadProgress(p)
    },
    onUploadError(error: Error) {
      toast({
        description: error.message == "Invalid config: FileCountMismatch" ? "Please upload only 1 file" : error.message,
        variant: "destructive"
      })
    }
  })
  const onDropAccepted = (acceptedFiles: File[]) => {
    startUpload(acceptedFiles)
    setIsDragOver(false)
  }
  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    const [file] = rejectedFiles
    setIsDragOver(false)
    toast({
      title: `${file.file.type} type is not supported.`,
      description: "Please choose a PNG, JPG or JPEG image instead",
      variant: "destructive"
    })
  }
  return (
    <div className={cn(
      'h-full w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center flex-col items-center cursor-pointer',
      {
        'ring-blue-900/25 bg-blue-900/10': isDragOver,
      }
    )}
    >
      <Dropzone
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        accept={{
          "image/png": [".png"],
          "image/jpeg": [".jpeg"],
          "image/jpg": [".jpg"],
        }}
        onDragEnter={() => setIsDragOver(true)}
        onDragLeave={() => setIsDragOver(false)}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className="flex flex-col justify-center items-center h-full w-full pt-1"
            {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragOver ?
              <MousePointerSquareDashed className="h-6 w-6 text-zinc-500 mb-2" /> :
              isUploading || isPending ?
                <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mb-2" /> :
                <Image className="h-6 w-6 text-zinc-500 mb-2" />
            }
            <div>
              {isUploading ? (
                <div>
                  <p className="text-center">Uploading...</p>
                  <Progress
                    value={uploadProgress}
                    className="mt-2 w-40 h-2 bg-gray-300"
                  />
                </div>
              ) : isPending ? (
                <div>
                  <p>please wait</p>
                </div>
              ) : isDragOver ? (
                <p>
                  <span className="font-semibold">Drop file</span> to upload
                </p>
              ) : (
                <p>
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              )
              }
            </div>
            {isPending ? null : (
              <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
            )}
          </div>
        )}
      </Dropzone >
      {uploadedImage && <UploadedImage uploadedImage={uploadedImage} />}
    </div>
  )

  // Displays information of the uploaded image
  function UploadedImage({ uploadedImage }: { uploadedImage: uploadedImage }) {
    return (
      <div className="flex justify-between items-center  border-2 border-gray-600 border-dashed rounded-lg w-2/5 min-w-min my-1 cursor-default">
        <FaImage className="mx-4" />
        <a
          href={uploadedImage.url}
          target="_blank"
          rel="noopener noreferrer" >
          <p className="text-sm hover:underline min-w-max">{uploadedImage.name} <span className="text-xs text-zinc-500">{prettyBytes(uploadedImage.size)}</span></p>
        </a>
        <DeleteImageBtn imgKey={uploadedImage.key} />
      </div>
    )
  }

  async function handleDeleteImage(key: string) {
    await deleteImage(key)
    setUploadedImage(null);
  }

  // Displays an alert dialog before deleting the uploaded image
  function DeleteImageBtn({ imgKey }: { imgKey: string }) {
    return <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <CircleX />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between">
              <span>
                Are you absolutely sure?
              </span>
              <TriangleAlert className="text-red-500" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete your image and you will have to reupload it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" asChild onClick={async () => await handleDeleteImage(imgKey)}>
              <AlertDialogAction>
                Delete
              </AlertDialogAction>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  }
}