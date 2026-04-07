interface Props {
  url: string;
  onClose: () => void;
}

export default function PdfPreviewModal({ url, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-xl w-[90%] max-w-3xl h-[90%] shadow-xl flex flex-col">

        <h2 className="text-lg font-semibold mb-3">Preview</h2>

        <div className="flex-1 border rounded overflow-hidden">
          {url.endsWith('.pdf') ? (
            <iframe
              src={url}
              title="PDF Preview"
              className="w-full h-full"
              frameBorder="0"
            />
          ) : (
            <img src={url} alt="Preview" className="w-full h-full object-contain" />
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-[#006591] text-white py-2 rounded-lg"
        >
          Close
        </button>

      </div>
    </div>
  );
}