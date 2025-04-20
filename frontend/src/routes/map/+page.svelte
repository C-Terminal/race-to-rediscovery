<script lang="ts">
  import { onMount } from 'svelte';
  // Import Leaflet CSS
  import 'leaflet/dist/leaflet.css';
  // Import Leaflet types
  import type { Map as LeafletMap, LatLngExpression } from 'leaflet';

  // --- Type Definitions ---
  interface SampleDataItem {
    area: string;
    population: number;
    year: number;
  }
  interface SampleDataResponse {
    description: string;
    source: string;
    data: SampleDataItem[];
  }
  interface SampleDataError {
      error: string;
  }

  // --- Component State Variables ---
  let sampleData: SampleDataResponse | SampleDataError | null = null;
  let mapContainer: HTMLDivElement | undefined;
  // Declare 'map' in the outer scope so both the async IIFE and the cleanup function can access it
  let map: LeafletMap | null = null;

  // --- Constants ---
  const API_BASE_URL = 'http://localhost:8000';
  // Location context: Mississauga, ON - April 20, 2025
  const initialCoords: LatLngExpression = [43.5890, -79.6441];
  const initialZoom: number = 11;

  // --- onMount Lifecycle Function ---
  // onMount itself is NOT async
  onMount(() => {
    console.log("Component mounted - running in browser");

    // Define and immediately invoke an async function (IIFE pattern)
    // This allows us to use await inside onMount without making onMount async
    (async () => {
        console.log("Async IIFE started");
        // Dynamically import Leaflet *inside* the async function
        const L = (await import('leaflet')).default;
        console.log("Leaflet dynamically imported");

        // --- Fetch Data ---
        try {
            const response = await fetch(`${API_BASE_URL}/api/data/sample`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            sampleData = await response.json() as SampleDataResponse;
            console.log("Data fetched:", sampleData);
        } catch (error: unknown) {
            console.error("Failed to fetch sample data:", error);
            if (error instanceof Error) {
                sampleData = { error: `Failed to load data: ${error.message}` };
            } else {
                sampleData = { error: `Failed to load data: An unknown error occurred` };
            }
        }

        // --- Initialize Leaflet Map ---
        // Check mapContainer exists. Map initialization happens within the async IIFE.
        if (mapContainer && !map) { // Check map is not already initialized
            console.log("Initializing Leaflet map...");
            // Assign to the 'map' variable declared in the outer scope
            map = L.map(mapContainer).setView(initialCoords, initialZoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker(initialCoords).addTo(map)
                .bindPopup('Mississauga City Centre Area <br> (Approx. view as of April 20, 2025)')
                .openPopup();
            console.log("Map initialized.");
        } else if(map) {
             console.log("Map already initialized (IIFE ran again?). Skipping initialization.");
        } else {
            console.error("Map container element not found when trying to initialize map.");
        }
    })(); // Immediately invoke the async function

    console.log("Synchronous part of onMount finished executing");

    // --- Cleanup Function ---
    // This is returned SYNCHRONOUSLY by onMount
    return () => {
      // It can access the 'map' variable from the outer scope,
      // which was assigned inside the async IIFE.
      if (map) {
        map.remove();
        map = null;
        console.log("Map instance removed on component destroy");
      } else {
        console.log("Cleanup called, but map instance was not found or already removed.");
      }
    };
  }); // End of onMount

</script>

<h1>Data Visualization PoC</h1>
<p>Displaying data relevant to Mississauga, Ontario (as of April 20, 2025).</p>

<section>
  <h2>Sample Data from Backend:</h2>
  {#if sampleData}
    {#if 'error' in sampleData}
      <p style="color: red;">{sampleData.error}</p>
    {:else}
      <pre>{JSON.stringify(sampleData, null, 2)}</pre>
    {/if}
  {:else}
    <p>Loading data...</p>
  {/if}
</section>

<section>
    <h2>Map Visualization (Leaflet)</h2>
    <div bind:this={mapContainer} id="map" style="height: 400px; width: 100%;"></div>
</section>

<style>
  #map {
    margin-top: 20px;
    border: 1px solid #ccc;
  }
  pre {
    background-color: #f4f4f4;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }
</style>