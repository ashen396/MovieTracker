import Image from 'next/image';
import { StarRating } from './StarRating';
import { Movie } from '@prisma/client';

export function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="group relative flex flex-col w-full min-w-0 bg-slate-900 rounded-xl overflow-hidden shadow-xl shadow-black/40 border border-slate-800 transition-all hover:-translate-y-2 hover:shadow-indigo-500/10 hover:border-slate-700/80 duration-300 antialiased">
      <div className="relative aspect-[320/512] bg-slate-800 overflow-hidden shrink-0">
        <Image 
          src={movie.posterPath}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform group-hover:scale-105 duration-500"
          placeholder="empty"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-80" />
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-slate-900/80 backdrop-blur text-xs font-semibold px-2.5 py-1 rounded-md text-amber-400 border border-slate-700/50 shadow-lg">
            {movie.rating}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-1.5 translate-y-2 group-hover:translate-y-0 transition-transform">
          <StarRating rating={movie.starRating} readonly size={14} />
          <p className="text-xs text-slate-300 font-medium tracking-wide">
            {movie.categories}
          </p>
        </div>
      </div>
      
      <div className="p-4 flex flex-col grow justify-between bg-slate-900 relative z-20">
        <h3 className="font-bold text-slate-100 text-lg leading-tight line-clamp-1 group-hover:text-indigo-400 transition-colors">
          {movie.title} <span className="text-slate-500 font-normal">({movie.year})</span>
        </h3>
      </div>
    </div>
  );
}
