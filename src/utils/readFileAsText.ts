export default function readFileAsText(path: string): Promise<String> {
    return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(path, (entry) => {
            (entry as any).file((file: File) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string)
                reader.onerror = reject;
                reader.readAsText(file)
            }, reject)
        })
    })
}