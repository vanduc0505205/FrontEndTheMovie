import { useState } from "react";

function MovieTrailer({ trailerUrl }: { trailerUrl: string }) {
  const [showTrailer, setShowTrailer] = useState(false);

  if (!trailerUrl) return null;

  const getYoutubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return `https://www.youtube.com/embed/${url}`;
    }
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)\s*([a-zA-Z0-9_-]{11})/);
    const videoId = match?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const embeddedUrl = getYoutubeEmbedUrl(trailerUrl);
  if (!embeddedUrl) return null;

  return (
    <div className="mt-6">
      {!showTrailer ? (
        <button
          onClick={() => setShowTrailer(true)}
          className="text-yellow-400 underline hover:text-yellow-300 text-lg"
        >
          ▶ Xem trailer
        </button>
      ) : (
        <div>
          <div className="mt-3 text-right">
            <button
              onClick={() => setShowTrailer(false)}
              className="text-sm text-gray-400 hover:text-red-400 underline"
            >
              ✖ Đóng trailer
            </button>
          </div>
          <div className="relative pt-[56.25%]">
            <iframe
              src={embeddedUrl}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieTrailer