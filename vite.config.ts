import { defineConfig } from 'vite';

export default defineConfig({
  // Με το base: './' η εφαρμογή θα λειτουργεί σωστά σε οποιοδήποτε υποφάκελο (subpath)
  // στο GitHub Pages (π.χ. https://username.github.io/OrthoRadio/)
  base: './',
});
