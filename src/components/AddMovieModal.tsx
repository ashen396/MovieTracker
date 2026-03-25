'use client';

import { useState } from 'react';
import { X, Upload, Loader2, Plus, Film } from 'lucide-react';
import { StarRating } from './StarRating';
import { addMovie } from '@/app/actions/movieActions';

export function AddMovieModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [starRating, setStarRating] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setPreviewUrl(null);
    setStarRating(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set('starRating', starRating.toString());

      const res = await addMovie(formData);

      if (res.success) {
        handleClose();
      } else {
        setError(res.error as string);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleOpen}
        className="fixed bottom-8 right-8 z-40 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] group"
      >
        <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleClose}
          />
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden duration-300 sm:my-8 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-400" />
                Add Movie
              </h2>
              <button 
                onClick={handleClose}
                className="text-slate-400 hover:text-white transition-colors bg-slate-800 py-1.5 px-1.5 rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto w-full p-6 subtle-scrollbar">
              <form id="add-movie-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="text-sm font-medium text-slate-300">Title</label>
                  <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    required 
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-slate-200"
                    placeholder="e.g. The Matrix"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="year" className="text-sm font-medium text-slate-300">Year</label>
                    <input 
                      type="number" 
                      id="year" 
                      name="year" 
                      required 
                      min="1800"
                      max={new Date().getFullYear() + 10}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-slate-200"
                      placeholder="e.g. 1999"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="rating" className="text-sm font-medium text-slate-300">Maturity Rating</label>
                    <select 
                      id="rating" 
                      name="rating" 
                      required
                      className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 transition-all font-medium text-slate-200"
                    >
                      <option value="G">G</option>
                      <option value="PG">PG</option>
                      <option value="PG-13">PG-13</option>
                      <option value="R">R</option>
                      <option value="NC-17">NC-17</option>
                      <option value="Unrated">Unrated</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="categories" className="text-sm font-medium text-slate-300">Categories / Genre</label>
                  <input 
                    type="text" 
                    id="categories" 
                    name="categories" 
                    required 
                    className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-600 text-slate-200"
                    placeholder="e.g. Sci-Fi, Action"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-300">Your Rating</label>
                  <div className="py-2 bg-slate-950/50 rounded-lg border border-slate-800/50 flex items-center justify-center">
                    <StarRating rating={starRating} readonly={false} onChange={setStarRating} size={28} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="poster" className="text-sm font-medium text-slate-300">Poster Image</label>
                  <div className="relative border-2 border-dashed border-slate-700 hover:border-indigo-500 transition-colors rounded-xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center group cursor-pointer h-48">
                    <input 
                      type="file" 
                      id="poster" 
                      name="poster" 
                      accept="image/*" 
                      required 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileChange}
                    />
                    {previewUrl ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900 pointer-events-none">
                        <img src={previewUrl} alt="Preview" className="h-full object-contain" />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-medium bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur">Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-slate-400 p-6 pointer-events-none">
                        <div className="p-3 bg-slate-800 rounded-full group-hover:scale-110 transition-transform group-hover:bg-indigo-500/20 group-hover:text-indigo-400">
                           <Upload className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-slate-300 mb-1">Click or drag poster to upload</p>
                          <p className="text-xs">JPG, PNG, WEBP (Auto resized to 320x512)</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900">
              <button 
                type="submit" 
                form="add-movie-form"
                disabled={isSubmitting || starRating === 0}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] shadow-lg shadow-indigo-500/25"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {isSubmitting ? 'Saving...' : 'Save Movie'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
