import { useState, useEffect } from 'react';

export const useFavoriteProjects = () => {
  const [favoriteProjects, setFavoriteProjects] = useState<string[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteProjects');
    if (savedFavorites) {
      setFavoriteProjects(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (projectId: string) => {
    setFavoriteProjects(prev => {
      let newFavorites;
      if (prev.includes(projectId)) {
        newFavorites = prev.filter(id => id !== projectId);
      } else {
        newFavorites = [...prev, projectId];
      }
      localStorage.setItem('favoriteProjects', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  return { favoriteProjects, toggleFavorite };
}; 