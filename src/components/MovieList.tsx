'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '@prisma/client';
import { getMovies } from '@/app/actions/movieActions';

export function MovieList({ initialMovies, initialHasMore }: { initialMovies: Movie[], initialHasMore: boolean }) {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    const nextPage = page + 1;
    const res = await getMovies(nextPage, 10);
    
    if (res.success && res.movies) {
      setMovies(prev => [...prev, ...res.movies]);
      setHasMore(res.hasMore || false);
      setPage(nextPage);
    }
    setIsLoading(false);
  }, [page, hasMore, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMore();
      }
    }, {
      rootMargin: '100px',
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loadMore]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="transition-opacity duration-500" style={{ animationDelay: `${(movie.id % 5) * 100}ms` }}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
      
      {movies.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p className="text-xl">No movies added yet.</p>
          <p className="mt-2 text-sm">Use the \"+ Add Movie\" button to get started.</p>
        </div>
      )}

      {hasMore && (
        <div ref={loaderRef} className="py-10 flex justify-center">
          <div className="flex gap-2 items-center text-indigo-400">
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      )}
    </>
  );
}
