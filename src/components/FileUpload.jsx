import { useState, useRef } from 'react';
import '../styles/FileUpload.css';

const ACCEPT = {
  thumbnail: { exts: ['jpg','jpeg','png','webp'], mime: 'image/jpeg,image/png,image/webp', maxMB: 5,  label: 'Image' },
  fichier:   { exts: ['pdf','mp4','jpg','jpeg','png','webp','glb','gltf'], mime: 'application/pdf,video/mp4,image/*,.glb,.gltf', maxMB: 50, label: 'Fichier' },
};

const ICONS = {
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="m21 15-5-5L5 21"/>
    </svg>
  ),
  pdf: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6M9 13h6M9 17h3"/>
    </svg>
  ),
  video: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="6" width="15" height="12" rx="2"/>
      <path d="m22 8-5 4 5 4V8z"/>
    </svg>
  ),
  file: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <path d="M14 2v6h6"/>
    </svg>
  ),
};

function getFileIcon(ext) {
  if (['jpg','jpeg','png','webp'].includes(ext)) return ICONS.image;
  if (ext === 'pdf') return ICONS.pdf;
  if (ext === 'mp4') return ICONS.video;
  return ICONS.file;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' o';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
  return (bytes / 1024 / 1024).toFixed(1) + ' Mo';
}

/**
 * Props :
 * - type       : "thumbnail" | "fichier"
 * - onUploaded : (url: string) => void   appelé quand l'upload réussit
 * - currentUrl : string | null           URL déjà enregistrée (pour affichage)
 * - token      : string                  JWT
 * - disabled   : bool
 */
export default function FileUpload({ type = 'thumbnail', onUploaded, currentUrl, token, disabled }) {
  const cfg       = ACCEPT[type];
  const inputRef  = useRef(null);

  const [dragging, setDragging]   = useState(false);
  const [preview, setPreview]     = useState(null);   // data URL pour image
  const [fileName, setFileName]   = useState(null);
  const [fileSize, setFileSize]   = useState(null);
  const [fileExt, setFileExt]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [error, setError]         = useState('');
  const [done, setDone]           = useState(false);

  const isImage = (ext) => ['jpg','jpeg','png','webp'].includes(ext);

  const validate = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!cfg.exts.includes(ext)) {
      return `Extension non autorisée. Accepté : ${cfg.exts.join(', ')}`;
    }
    if (file.size > cfg.maxMB * 1024 * 1024) {
      return `Fichier trop lourd. Maximum : ${cfg.maxMB} Mo`;
    }
    return null;
  };

  const handleFile = async (file) => {
    if (!file) return;
    setError('');
    setDone(false);

    const err = validate(file);
    if (err) { setError(err); return; }

    const ext = file.name.split('.').pop().toLowerCase();
    setFileName(file.name);
    setFileSize(file.size);
    setFileExt(ext);

    // Preview image locale
    if (isImage(ext)) {
      const reader = new FileReader();
      reader.onload = e => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Upload
    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulation de progression via XMLHttpRequest
      const url = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `http://localhost:8080/api/upload/${type}`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            if (data.url) resolve(data.url);
            else reject(new Error(data.error || 'Réponse invalide'));
          } else {
            try {
              const data = JSON.parse(xhr.responseText);
              reject(new Error(data.error || `Erreur ${xhr.status}`));
            } catch {
              reject(new Error(`Erreur ${xhr.status}`));
            }
          }
        };

        xhr.onerror = () => reject(new Error('Erreur réseau'));
        xhr.send(formData);
      });

      setProgress(100);
      setDone(true);
      onUploaded(url);

    } catch (e) {
      setError(e.message);
      setPreview(null);
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setPreview(null);
    setFileName(null);
    setFileSize(null);
    setFileExt(null);
    setError('');
    setDone(false);
    setProgress(0);
    onUploaded(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  /* ── Affichage de l'état actuel ── */
  const displayUrl = preview || currentUrl;
  const isCurrentImage = currentUrl && /\.(jpg|jpeg|png|webp)$/i.test(currentUrl);

  return (
    <div className={`fu-wrap ${disabled ? 'fu-wrap--disabled' : ''}`}>

      {/* Zone de dépôt */}
      {!fileName && !currentUrl && (
        <div
          className={`fu-drop ${dragging ? 'fu-drop--over' : ''}`}
          onDragEnter={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && !disabled && inputRef.current?.click()}
        >
          <div className="fu-drop__icon">
            {type === 'thumbnail' ? ICONS.image : ICONS.file}
          </div>
          <p className="fu-drop__title">
            {dragging ? 'Déposez ici' : `Glisser-déposer ou cliquer`}
          </p>
          <p className="fu-drop__hint">
            {cfg.exts.join(', ')} · max {cfg.maxMB} Mo
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={cfg.mime}
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
            disabled={disabled}
          />
        </div>
      )}

      {/* Aperçu fichier sélectionné / déjà uploadé */}
      {(fileName || currentUrl) && (
        <div className="fu-preview">
          {/* Vignette image */}
          {(preview || (currentUrl && isCurrentImage)) && (
            <div className="fu-preview__thumb">
              <img src={displayUrl} alt="aperçu" />
            </div>
          )}

          {/* Infos fichier non-image */}
          {!preview && !(currentUrl && isCurrentImage) && fileExt && (
            <div className="fu-preview__icon">
              {getFileIcon(fileExt)}
            </div>
          )}

          <div className="fu-preview__info">
            <span className="fu-preview__name">
              {fileName || currentUrl?.split('/').pop()}
            </span>
            {fileSize && (
              <span className="fu-preview__size">{formatSize(fileSize)}</span>
            )}

            {/* Barre de progression */}
            {uploading && (
              <div className="fu-progress">
                <div className="fu-progress__bar" style={{ width: `${progress}%` }} />
                <span className="fu-progress__label">{progress}%</span>
              </div>
            )}

            {done && (
              <span className="fu-preview__done">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l3.5 3.5L13 5"/>
                </svg>
                Uploadé
              </span>
            )}

            {!uploading && currentUrl && !done && (
              <span className="fu-preview__done">
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 8l3.5 3.5L13 5"/>
                </svg>
                Fichier enregistré
              </span>
            )}
          </div>

          {/* Bouton supprimer */}
          {!uploading && !disabled && (
            <button className="fu-preview__remove" onClick={reset} title="Retirer le fichier">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 2l12 12M14 2L2 14"/>
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="fu-error">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="6"/><path d="M8 5v4M8 11v.5"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}