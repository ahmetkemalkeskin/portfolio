import { useState, useEffect, useCallback } from "react";
const EDIT_MODE_STORAGE_KEY = "portfolio.editMode";
const EDIT_MODE_EVENT = "portfolio:edit-mode-changed";
function readEditMode() {
  try {
    return localStorage.getItem(EDIT_MODE_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}
function useEditMode() {
  const [isEditMode, setIsEditMode] = useState(true);
  useEffect(() => {
    setIsEditMode(readEditMode());
    const onChange = () => setIsEditMode(readEditMode());
    window.addEventListener(EDIT_MODE_EVENT, onChange);
    window.addEventListener("focus", onChange);
    return () => {
      window.removeEventListener(EDIT_MODE_EVENT, onChange);
      window.removeEventListener("focus", onChange);
    };
  }, []);
  const setEditMode = useCallback((next) => {
    try {
      localStorage.setItem(EDIT_MODE_STORAGE_KEY, next ? "on" : "off");
    } catch {
    }
    setIsEditMode(next);
    window.dispatchEvent(new Event(EDIT_MODE_EVENT));
  }, []);
  const toggleEditMode = useCallback(() => {
    setEditMode(!isEditMode);
  }, [isEditMode, setEditMode]);
  return { isEditMode, setEditMode, toggleEditMode };
}
export {
  useEditMode as u
};
