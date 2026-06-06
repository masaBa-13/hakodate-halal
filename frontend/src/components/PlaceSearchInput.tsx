import { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps } from '../utils/loadGoogleMaps'

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? ''
const HAKODATE = { lat: 41.7688, lng: 140.7290 }
const BIAS_DELTA = 0.4 // 約40km

export interface PlaceResult {
  name: string
  formattedAddress: string
  lat: number
  lng: number
  placeId: string
  website: string
}

interface Props {
  onSelect: (place: PlaceResult) => void
  inputStyle?: React.CSSProperties
  placeholder?: string
}

export default function PlaceSearchInput({ onSelect, inputStyle, placeholder }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const acRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!API_KEY) return
    loadGoogleMaps(API_KEY)
      .then(() => setReady(true))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!ready || !inputRef.current) return

    // Google Maps の検索エンジンをそのまま使用
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['name', 'formatted_address', 'geometry', 'place_id', 'website'],
      componentRestrictions: { country: 'jp' },
    })
    acRef.current = ac

    // デフォルトは函館エリアにバイアス
    applyBias(HAKODATE.lat, HAKODATE.lng)

    // 位置情報が取れたらユーザーの現在地に切り替え
    navigator.geolocation.getCurrentPosition(
      (pos) => applyBias(pos.coords.latitude, pos.coords.longitude),
      () => {} // 拒否された場合は函館デフォルトのまま
    )

    ac.addListener('place_changed', () => {
      const place = ac.getPlace()
      if (!place.geometry?.location) return
      onSelect({
        name: place.name ?? '',
        formattedAddress: place.formatted_address ?? '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        placeId: place.place_id ?? '',
        website: (place as google.maps.places.PlaceResult).website ?? '',
      })
    })
  }, [ready, onSelect])

  function applyBias(lat: number, lng: number) {
    acRef.current?.setBounds(
      new google.maps.LatLngBounds(
        { lat: lat - BIAS_DELTA, lng: lng - BIAS_DELTA },
        { lat: lat + BIAS_DELTA, lng: lng + BIAS_DELTA }
      )
    )
  }

  if (!API_KEY) {
    return (
      <p style={{ fontSize: '13px', color: '#f97316', lineHeight: 1.6 }}>
        ⚠ Google Maps APIキーが未設定のため店舗検索を利用できません。<br />
        <code>frontend/.env</code> に <code>VITE_GOOGLE_MAPS_API_KEY</code> を設定してください。
      </p>
    )
  }

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder ?? 'Googleマップで店舗を検索... (例: 函館 ラーメン)'}
      style={inputStyle}
      // autocomplete を無効化してブラウザ補完と競合しないようにする
      autoComplete="off"
    />
  )
}
