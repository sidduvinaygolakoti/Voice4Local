import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import L from 'leaflet'

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      try {
        // Reverse geocode using Nominatim (free)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        )
        const data = await res.json()
        onLocationSelect({
          lat,
          lng,
          address: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        })
      } catch {
        onLocationSelect({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
      }
    },
  })
  return null
}

export default function MapPicker({ value, onChange }) {
  const defaultCenter = [17.3850, 78.4867] // Hyderabad
  const [marker, setMarker] = useState(
    value?.lat ? [value.lat, value.lng] : null
  )
  const [isLocating, setIsLocating] = useState(false)

  const handleLocationSelect = ({ lat, lng, address }) => {
    setMarker([lat, lng])
    onChange({ lat, lng, address })
  }

  const getCurrentLocation = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const data = await res.json()
          handleLocationSelect({ lat, lng, address: data.display_name })
        } catch {
          handleLocationSelect({ lat, lng, address: `${lat.toFixed(5)}, ${lng.toFixed(5)}` })
        }
        setIsLocating(false)
      },
      () => setIsLocating(false)
    )
  }

  return (
    <div className="space-y-3">
      {/* Current location button */}
      <button
        id="get-current-location-btn"
        type="button"
        onClick={getCurrentLocation}
        disabled={isLocating}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-primary-500 border border-primary/30 hover:bg-primary/10 transition-all disabled:opacity-50"
      >
        <MapPin size={15} className={isLocating ? 'animate-bounce' : ''} />
        {isLocating ? 'Getting location...' : 'Use My Current Location'}
      </button>

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-white/20 shadow-md" style={{ height: 300 }}>
        <MapContainer
          center={marker || defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationPicker onLocationSelect={handleLocationSelect} />
          {marker && <Marker position={marker} icon={customIcon} />}
        </MapContainer>
      </div>

      {value?.address && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <MapPin size={15} className="text-primary-500 shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{value.address}</p>
        </div>
      )}

      <p className="text-xs text-gray-500">📍 Click on the map to drop a pin at the problem location</p>
    </div>
  )
}
