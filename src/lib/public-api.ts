import storyData from '../data/story.json';
import merchData from '../data/merch.json';

export async function fetchVenues() {
  try {
    const res = await fetch('/api/admin/venues');
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function fetchStory() {
  try {
    const res = await fetch('/api/admin/story');
    if (res.ok) return await res.json();
  } catch {}
  return storyData;
}

export async function fetchMerch() {
  try {
    const res = await fetch('/api/admin/merch');
    if (res.ok) return await res.json();
  } catch {}
  return merchData;
}

export async function fetchTestimonials() {
  try {
    const res = await fetch('/api/admin/testimonials');
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function fetchBeerProfile() {
  try {
    const res = await fetch('/api/admin/beer-profile');
    if (res.ok) return await res.json();
  } catch {}
  return null;
}

export async function fetchBrandHub() {
  try {
    const res = await fetch('/api/admin/brandhub');
    if (res.ok) return await res.json();
  } catch {}
  return null;
}
