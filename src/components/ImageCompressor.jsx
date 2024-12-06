import React, { useState, useRef } from 'react';
import styled from '@emotion/styled';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const UploadArea = styled.div`
  border: 2px dashed #007AFF;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #F5F5F7;
  }
`;

const ImagePreviewArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const PreviewCard = styled.div`
  background: #F5F5F7;
  padding: 1rem;
  border-radius: 12px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

const Button = styled.button`
  background: #007AFF;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: #0066CC;
  }
`;

const ImageInfo = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
`;

const ControlPanel = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #F5F5F7;
  border-radius: 12px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 0.5rem 0;
`;

const NumberInput = styled.input`
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
  -webkit-appearance: none;
  height: 4px;
  background: #007AFF;
  border-radius: 2px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #007AFF;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const PresetButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #007AFF;
  border-radius: 6px;
  background: ${props => props.active ? '#007AFF' : 'transparent'};
  color: ${props => props.active ? 'white' : '#007AFF'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#0066CC' : 'rgba(0, 122, 255, 0.1)'};
  }
`;

const PresetGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

const DPI_PRESETS = [
  { label: '网页', value: 72 },
  { label: '打印', value: 150 },
  { label: '高清', value: 300 },
  { label: '超清', value: 600 }
];

function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [compressedSize, setCompressedSize] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [files, setFiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const uploadAreaRef = useRef(null);
  const [customMode, setCustomMode] = useState('auto'); // 'auto' | 'size' | 'dpi'
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [customDpi, setCustomDpi] = useState(72);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [format, setFormat] = useState('auto');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setFiles(Array.from(files));
      await processImage(files[0]);
    }
  };

  const processImage = async (file) => {
    // 基础配置
    const options = {
      maxSizeMB: 1,
      useWebWorker: true,
      alwaysKeepResolution: false, // 确保分辨率可以改变
    };

    // 根据不同模式设置不同的压缩选项
    switch (customMode) {
      case 'auto':
        options.maxWidthOrHeight = 1920;
        options.quality = quality;
        options.initialQuality = quality; // 设置初始质量
        break;
      
      case 'size':
        // 强制设置新尺寸
        if (customWidth && customHeight) {
          options.width = Number(customWidth);
          options.height = Number(customHeight);
          options.maxWidthOrHeight = Math.max(Number(customWidth), Number(customHeight));
          options.quality = 0.8;
          options.resize = true; // 强制调整大小
        }
        break;
      
      case 'dpi':
        // 根据 DPI 计算新的尺寸
        const scaleFactor = customDpi / 72;
        options.width = Math.round(originalDimensions.width * scaleFactor);
        options.height = Math.round(originalDimensions.height * scaleFactor);
        options.quality = 0.8;
        options.resize = true;
        break;
    }

    // 设置输出格式
    if (format !== 'auto') {
      options.fileType = `image/${format}`;
    }

    try {
      console.log('压缩选项:', options); // 添加日志以便调试

      // 先创建一个临时的 canvas 来调整图片尺寸
      if (customMode !== 'auto') {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise(resolve => img.onload = resolve);

        const canvas = document.createElement('canvas');
        canvas.width = options.width || img.width;
        canvas.height = options.height || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 将 canvas 转换为 blob
        const blob = await new Promise(resolve => canvas.toBlob(resolve, `image/${format || 'jpeg'}`, options.quality));
        file = new File([blob], file.name, { type: blob.type });
      }

      const compressedFile = await imageCompression(file, options);
      
      setOriginalImage(URL.createObjectURL(file));
      setCompressedImage(URL.createObjectURL(compressedFile));
      setOriginalSize(file.size);
      setCompressedSize(compressedFile.size);

      console.log('原始大小:', file.size);
      console.log('压缩后大小:', compressedFile.size);
      console.log('压缩比例:', (compressedFile.size / file.size * 100).toFixed(2) + '%');
    } catch (error) {
      console.error('压缩失败:', error);
    }
  };

  const handleDimensionChange = (dimension, value) => {
    const numValue = Number(value);
    if (dimension === 'width') {
      setCustomWidth(value);
      if (maintainAspectRatio && originalDimensions.width) {
        const ratio = originalDimensions.height / originalDimensions.width;
        setCustomHeight(Math.round(numValue * ratio));
      }
    } else {
      setCustomHeight(value);
      if (maintainAspectRatio && originalDimensions.height) {
        const ratio = originalDimensions.width / originalDimensions.height;
        setCustomWidth(Math.round(numValue * ratio));
      }
    }
  };

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setOriginalDimensions({ width: naturalWidth, height: naturalHeight });
    if (!customWidth && !customHeight) {
      setCustomWidth(naturalWidth);
      setCustomHeight(naturalHeight);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = compressedImage;
    link.download = 'compressed-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDpiPresetClick = (dpi) => {
    setCustomDpi(dpi);
    processImage(files[currentIndex]);
  };

  return (
    <Container>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
        id="imageInput"
        multiple
      />
      <UploadArea as="label" htmlFor="imageInput">
        <div>点击或拖拽图片到此处上传</div>
        <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
          支持 PNG、JPG 格式
        </div>
      </UploadArea>

      {originalImage && (
        <>
          <ControlPanel>
            <div>
              <label>压缩模式:</label>
              <Select
                value={customMode}
                onChange={(e) => {
                  setCustomMode(e.target.value);
                  setCustomWidth('');
                  setCustomHeight('');
                  setCustomDpi(72);
                }}
              >
                <option value="auto">自动压缩</option>
                <option value="size">自定义尺寸</option>
                <option value="dpi">自定义像素密度</option>
              </Select>

              {customMode === 'auto' && (
                <div>
                  <label>压缩质量: {Math.round(quality * 100)}%</label>
                  <Slider
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => {
                      setQuality(Number(e.target.value));
                      processImage(files[currentIndex]);
                    }}
                  />
                </div>
              )}

              {customMode === 'size' && (
                <>
                  <InputGroup>
                    <label>宽度:</label>
                    <NumberInput
                      type="number"
                      value={customWidth}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                      min="1"
                      placeholder="输入宽度"
                    />
                    <label>高度:</label>
                    <NumberInput
                      type="number"
                      value={customHeight}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                      min="1"
                      placeholder="输入高度"
                    />
                    <span>像素</span>
                  </InputGroup>
                  <RadioLabel>
                    <input
                      type="checkbox"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    />
                    <span>保持宽高比</span>
                  </RadioLabel>
                </>
              )}

              {customMode === 'dpi' && (
                <>
                  <PresetGroup>
                    {DPI_PRESETS.map(preset => (
                      <PresetButton
                        key={preset.value}
                        active={customDpi === preset.value}
                        onClick={() => handleDpiPresetClick(preset.value)}
                      >
                        {preset.label} ({preset.value} DPI)
                      </PresetButton>
                    ))}
                  </PresetGroup>
                  <InputGroup>
                    <label>自定义DPI:</label>
                    <NumberInput
                      type="number"
                      value={customDpi}
                      onChange={(e) => {
                        setCustomDpi(Number(e.target.value));
                        processImage(files[currentIndex]);
                      }}
                      min="1"
                      max="600"
                      placeholder="输入DPI值"
                    />
                    <span>dpi</span>
                  </InputGroup>
                </>
              )}

              <div style={{ marginTop: '1rem' }}>
                <label>输出格式:</label>
                <Select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value);
                    processImage(files[currentIndex]);
                  }}
                >
                  <option value="auto">保持原格式</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                </Select>
              </div>
            </div>
          </ControlPanel>

          <ImagePreviewArea>
            <PreviewCard>
              <h3>原始图片</h3>
              <img src={originalImage} alt="原始图片" onLoad={handleImageLoad} />
              <ImageInfo>
                文件大小: {formatSize(originalSize)}
                <br />
                尺寸: {originalDimensions.width} × {originalDimensions.height} px
              </ImageInfo>
            </PreviewCard>
            
            <PreviewCard>
              <h3>压缩后</h3>
              <img src={compressedImage} alt="压缩后的图片" />
              <ImageInfo>
                文件大小: {formatSize(compressedSize)}
                {originalSize && compressedSize && (
                  <span style={{ marginLeft: '1rem' }}>
                    (节省 {Math.round((originalSize - compressedSize) / originalSize * 100)}%)
                  </span>
                )}
              </ImageInfo>
            </PreviewCard>
          </ImagePreviewArea>

          {compressedImage && (
            <div style={{ textAlign: 'center' }}>
              <Button onClick={handleDownload}>
                下载压缩后的图片
              </Button>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default ImageCompressor;