// hooks/useSavedInternships.js
import { useState, useEffect, useCallback } from 'react';
import savedInternshipsService from '../utils/SavedInternshipsService';

export const useSavedInternships = () => {
  const [savedInternships, setSavedInternships] = useState([]);
  const [savedInternshipIds, setSavedInternshipIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Load saved internships on mount
  useEffect(() => {
    const loadSavedInternships = () => {
      try {
        const saved = savedInternshipsService.getSavedInternships();
        const ids = savedInternshipsService.getSavedInternshipIds();
        setSavedInternships(saved);
        setSavedInternshipIds(ids);
      } catch (error) {
        console.error('Error loading saved internships:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedInternships();
  }, []);

  // Save an internship (handles both regular and live internships)
  const saveInternship = useCallback((internship, type = 'regular') => {
    const success = savedInternshipsService.saveInternship(internship, type);
    if (success) {
      // Refresh the state
      const saved = savedInternshipsService.getSavedInternships();
      const ids = savedInternshipsService.getSavedInternshipIds();
      setSavedInternships(saved);
      setSavedInternshipIds(ids);
      return true;
    }
    return false;
  }, []);

  // Remove a saved internship by unique ID
  const removeSavedInternship = useCallback((uniqueId) => {
    const success = savedInternshipsService.removeSavedInternship(uniqueId);
    if (success) {
      setSavedInternships(prev => prev.filter(item => item.uniqueId !== uniqueId));
      setSavedInternshipIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(uniqueId);
        return newSet;
      });
      return true;
    }
    return false;
  }, []);

  // Toggle save status for any internship type
  const toggleSaveInternship = useCallback((internship, type = 'regular') => {
    const uniqueId = type === 'live' ? `live_${internship.jobId || internship.id}` : `regular_${internship.id}`;
    const isCurrentlySaved = savedInternshipIds.has(uniqueId);
    
    if (isCurrentlySaved) {
      return removeSavedInternship(uniqueId);
    } else {
      return saveInternship(internship, type);
    }
  }, [savedInternshipIds, saveInternship, removeSavedInternship]);

  // Check if internship is saved (works for both types)
  const isInternshipSaved = useCallback((internship, type = 'regular') => {
    const uniqueId = type === 'live' ? `live_${internship.jobId || internship.id}` : `regular_${internship.id}`;
    return savedInternshipIds.has(uniqueId);
  }, [savedInternshipIds]);

  // Clear all saved internships
  const clearAllSaved = useCallback(() => {
    const success = savedInternshipsService.clearAllSaved();
    if (success) {
      setSavedInternships([]);
      setSavedInternshipIds(new Set());
      return true;
    }
    return false;
  }, []);

  // Get saved internships by type
  const getSavedInternshipsByType = useCallback((type) => {
    return savedInternships.filter(item => item.type === type);
  }, [savedInternships]);

  // Get counts by type
  const getCountsByType = useCallback(() => {
    const regular = savedInternships.filter(item => item.type === 'regular').length;
    const live = savedInternships.filter(item => item.type === 'live').length;
    return { regular, live, total: regular + live };
  }, [savedInternships]);

  return {
    savedInternships,
    savedInternshipIds,
    loading,
    saveInternship,
    removeSavedInternship,
    toggleSaveInternship,
    isInternshipSaved,
    clearAllSaved,
    getSavedInternshipsByType,
    getCountsByType,
    savedCount: savedInternships.length
  };
};