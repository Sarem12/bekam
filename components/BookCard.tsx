// components/BookCard.tsx

interface BookCardProps {
  title: string;
  grade: number | string;
  imageUrl: string;
  subject: string;
}

export const BookCard = ({ title, grade, imageUrl, subject }: BookCardProps) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
      {/* Image / Cover Section */}
      <div className="h-48 bg-slate-100 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
            No Cover
          </div>
        )}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
          Grade {grade}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 text-sm mt-2 font-medium">
          {subject}
        </p>
        
        <button className="w-full mt-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform">
          View Units
        </button>
      </div>
    </div>
  );
};