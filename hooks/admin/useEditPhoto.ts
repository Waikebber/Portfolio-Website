"use client";

import { useState } from "react";
import type { AdminPhoto } from "./usePhotos";

export function useEditPhoto(allPhotos: AdminPhoto[], onSaved: () => void) {
  const [photo, setPhoto] = useState<AdminPhoto | null>(null);
  const [editRegion, setEditRegion] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [showNewLocation, setShowNewLocation] = useState(false);
  const [isHero, setIsHero] = useState(false);
  const [editOrder, setEditOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locationsForRegion = [
    ...new Set(allPhotos.filter((p) => p.region === editRegion).map((p) => p.location)),
  ];

  function open(p: AdminPhoto) {
    setPhoto(p);
    setEditRegion(p.region);
    setEditLocation(p.location);
    setIsHero(p.is_hero);
    setEditOrder(p.display_order);
    setNewLocation("");
    setShowNewLocation(false);
    setError(null);
  }

  function close() {
    setPhoto(null);
    setError(null);
  }

  async function save() {
    if (!photo) return;
    setSaving(true);
    setError(null);
    const location = showNewLocation && newLocation ? newLocation : editLocation;
    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ region: editRegion, location, is_hero: isHero, display_order: editOrder }),
    });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg);
    } else {
      close();
      onSaved();
    }
    setSaving(false);
  }

  async function deletePhoto() {
    if (!photo) return;
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
    if (!res.ok) {
      const { error: msg } = await res.json();
      setError(msg);
    } else {
      close();
      onSaved();
    }
    setDeleting(false);
  }

  return {
    photo, editRegion, setEditRegion,
    editLocation, setEditLocation,
    newLocation, setNewLocation,
    showNewLocation, setShowNewLocation,
    isHero, setIsHero,
    editOrder, setEditOrder,
    totalPhotos: allPhotos.length,
    locationsForRegion,
    saving, deleting, error,
    open, close, save, deletePhoto,
  };
}
