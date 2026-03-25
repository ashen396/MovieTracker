'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function addMovie(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const year = parseInt(formData.get('year') as string);
    const rating = formData.get('rating') as string;
    const categories = formData.get('categories') as string;
    const starRating = parseFloat(formData.get('starRating') as string);
    const poster = formData.get('poster') as File;

    if (!title || isNaN(year) || !poster || poster.size === 0) {
      throw new Error('Missing required fields');
    }

    const ext = path.extname(poster.name) || '.jpg';
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const postersDir = path.join(process.cwd(), 'public', 'posters');
    
    // Ensure directory exists
    try {
      await fs.access(postersDir);
    } catch {
      await fs.mkdir(postersDir, { recursive: true });
    }

    const filepath = path.join(postersDir, filename);

    // Read file and resize with sharp
    const arrayBuffer = await poster.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await sharp(buffer)
      .resize(320, 512, { fit: 'cover' })
      .toFile(filepath);

    const publicPath = `/posters/${filename}`;

    const movie = await prisma.movie.create({
      data: {
        title,
        year,
        rating,
        categories,
        starRating,
        posterPath: publicPath,
      },
    });

    revalidatePath('/');
    return { success: true, movie };
  } catch (error: any) {
    console.error('Error adding movie:', error);
    return { success: false, error: error.message || 'Failed to add movie' };
  }
}

export async function getMovies(page = 1, limit = 10) {
  try {
    const skip = (page - 1) * limit;
    const movies = await prisma.movie.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    
    // Check if there are more
    const totalCount = await prisma.movie.count();
    const hasMore = skip + limit < totalCount;
    
    return { success: true, movies, hasMore };
  } catch (error: any) {
    console.error('Error getting movies:', error);
    return { success: false, error: 'Failed to fetch movies', movies: [], hasMore: false };
  }
}
