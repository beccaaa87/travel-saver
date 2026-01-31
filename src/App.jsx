import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [savedPlaces, setSavedPlaces] = useState([])
  const [uploading, setUploading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  // Load saved places from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('travelSaverPlaces')
    if (saved) {
      try {
        setSavedPlaces(JSON.parse(saved))
      } catch (e) {
        console.error('Error loading saved places:', e)
      }
    }
  }, [])

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    setUploading(true)
    setError(null)
    setExtractedData(null)

    try {
      // Convert image to base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const mediaType = file.type

      // Call our serverless function (avoids CORS issues)
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          mediaType: mediaType
        })
      })

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error.message || 'API error')
      }

      const textContent = data.content.find(c => c.type === 'text')?.text || ''
      
      // Clean and parse JSON
      let cleanText = textContent.trim()
      cleanText = cleanText.replace(/```json\s*/g, '')
      cleanText = cleanText.replace(/```\s*/g, '')
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanText = jsonMatch[0]
      }

      const placeData = JSON.parse(cleanText)

      if (!placeData.placeName) {
        setError("Couldn't find a clear location in this screenshot. Try one with a location tag or place mentioned in the caption!")
        setUploading(false)
        return
      }

      // Add metadata
      placeData.id = Date.now()
      placeData.savedAt = new Date().toISOString()
      placeData.image = `data:${mediaType};base64,${base64}`

      setExtractedData(placeData)
      setUploading(false)

    } catch (err) {
      console.error('Upload error:', err)
      setError(`Failed to process image: ${err.message}`)
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const savePlace = () => {
    if (!extractedData) return

    const updated = [...savedPlaces, extractedData]
    setSavedPlaces(updated)
    localStorage.setItem('travelSaverPlaces', JSON.stringify(updated))
    setExtractedData(null)
  }

  const deletePlace = (id) => {
    const updated = savedPlaces.filter(p => p.id !== id)
    setSavedPlaces(updated)
    localStorage.setItem('travelSaverPlaces', JSON.stringify(updated))
  }

  const cancelExtraction = () => {
    setExtractedData(null)
    setError(null)
  }

  return (
    <div className="container">
      <h1>🌍 Travel Saver</h1>
      <p className="subtitle">Save your favorite travel destinations from Instagram & TikTok</p>

      <div 
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
        />
        {uploading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Analyzing screenshot...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📸</div>
            <div className="upload-text">Click or drag to upload screenshot</div>
            <div className="upload-hint">Instagram, TikTok, or any travel content</div>
          </>
        )}
      </div>

      {error && (
        <div className="error">{error}</div>
      )}

      {extractedData && (
        <div className="preview-card">
          <div className="preview-header">
            <div className="preview-title">Place Found! ✨</div>
            <div className="category-badge">{extractedData.category}</div>
          </div>

          <div className="preview-grid">
            <img src={extractedData.image} alt={extractedData.placeName} className="preview-image" />
            
            <div className="preview-details">
              <h3>{extractedData.placeName}</h3>
              <div className="location">
                <span className="location-icon">📍</span>
                {extractedData.city}, {extractedData.country}
              </div>
              <p className="description">{extractedData.description}</p>
            </div>
          </div>

          <div className="button-actions">
            <button className="button button-primary" onClick={savePlace}>
              Save to My Places
            </button>
            <button className="button button-secondary" onClick={cancelExtraction}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="saved-places">
        <div className="saved-header">
          <h2 className="saved-title">Saved Places</h2>
          <div className="saved-count">{savedPlaces.length}</div>
        </div>

        {savedPlaces.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <p className="empty-text">No saved places yet. Upload a screenshot to get started!</p>
          </div>
        ) : (
          <div className="places-grid">
            {savedPlaces.map((place) => (
              <div key={place.id} className="place-card">
                <img src={place.image} alt={place.placeName} className="place-image" />
                <div className="place-content">
                  <h3 className="place-name">{place.placeName}</h3>
                  <div className="place-location">
                    <span className="location-icon">📍</span>
                    {place.city}, {place.country}
                  </div>
                  <p className="place-description">{place.description}</p>
                  <div className="place-footer">
                    <span className="category-badge category-small">
                      {place.category}
                    </span>
                    <button className="delete-button" onClick={() => deletePlace(place.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
