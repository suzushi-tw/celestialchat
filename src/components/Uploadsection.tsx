'use client'

// import { uploadToS3 } from '@/lib/s3'
import { Inbox, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

function Uploadsection() {

    const [isUploading, setIsUploading] = useState(false)
    const [isCreatingChat, setIsCreatingChat] = useState(false)
    const router = useRouter()
    // const storage = getStorage(app)


    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
        },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File too large (limit: 10MB)');
                return;
            }

            try {
                setIsUploading(true);
                // Convert the file to a format suitable for your API
                // This example assumes your API accepts a base64-encoded string
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64data = reader.result;
                    const response = await fetch('/api/detectDeepfake', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ image: base64data }),
                    });

                    if (response.ok) {
                        const { isFake } = await response.json();
                        toast.success(isFake ? 'The image is fake.' : 'The image is genuine.');
                    } else {
                        toast.error('Failed to check deepfake');
                    }
                };
                reader.readAsDataURL(file);
            } catch (err) {
                toast.error('Something went wrong ...');
                console.log(err);
            } finally {
                setIsUploading(false);
            }
        },
    });
    return (
        <div>
            <div className="p-2 bg-white rounded-2xl">
                <div
                    {...getRootProps({
                        className:
                            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col hover:border-blue-300 focus:border-blue-300 focus:border-solid outline-none',
                    })}
                >
                    <input {...getInputProps()} />
                    {isUploading || isCreatingChat ? (
                        <>
                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                            <p className="mt-2 text-sm text-slate-400">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <Inbox className="w-10 h-10 text-blue-500" />
                            <p className="mt-2 text-sm text-slate-400">Drop your file here !</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Uploadsection
