/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock html5-qrcode
const mockHtml5QrCode = {
  start: jest.fn(),
  stop: jest.fn(),
  clear: jest.fn(),
  scanFile: jest.fn(),
};

const mockGetCameras = jest.fn();

// Mock antd components
jest.mock('antd', () => ({
  Button: ({ children, onClick, type, danger, disabled, icon, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={`button-${type || 'default'}`}
      data-danger={danger}
      className={className}
    >
      {icon && <span data-testid="button-icon">{icon}</span>}
      {children}
    </button>
  ),
  Typography: {
    Title: ({ children }) => <h1>{children}</h1>,
  },
  Select: ({ children, onChange, value, disabled, placeholder, className }) => (
    <select
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value || ''}
      disabled={disabled}
      data-testid="camera-select"
      className={className}
    >
      <option value="" disabled>{placeholder}</option>
      {children}
    </select>
  ),
  Upload: ({ children, beforeUpload, accept }) => (
    <div data-testid="upload-component" data-accept={accept}>
      <input
        type="file"
        data-testid="file-input"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && beforeUpload) {
            beforeUpload(file);
          }
        }}
        style={{ display: 'none' }}
      />
      <div data-testid="upload-trigger">
        {children}
      </div>
    </div>
  ),
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Mock antd icons
jest.mock('@ant-design/icons', () => ({
  UploadOutlined: () => <span data-testid="upload-icon">Upload Icon</span>,
}));

// Mock html5-qrcode
jest.mock('html5-qrcode', () => ({
  Html5Qrcode: jest.fn(() => mockHtml5QrCode),
  Html5QrcodeScanner: jest.fn(),
}));

// Import after mocks
import QRScanner from './QRScanner';

const { Html5Qrcode } = require('html5-qrcode');
const { message } = require('antd');

// Set up the getCameras mock
Html5Qrcode.getCameras = mockGetCameras;

describe('QRScanner Component', () => {
  const mockOnScanSuccess = jest.fn();
  const mockCameras = [
    { id: 'camera1', label: 'Front Camera' },
    { id: 'camera2', label: 'Back Camera' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCameras.mockResolvedValue(mockCameras);
    mockHtml5QrCode.start.mockResolvedValue();
    mockHtml5QrCode.stop.mockResolvedValue();
    mockHtml5QrCode.clear.mockResolvedValue();
    mockHtml5QrCode.scanFile.mockResolvedValue('test-qr-code');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });



  it('shows error message when trying to start scanning without selected camera', async () => {
    mockGetCameras.mockResolvedValue([]);
    
    await act(async () => {
      render(<QRScanner onScanSuccess={mockOnScanSuccess} />);
    });

    const startButton = screen.getByTestId('button-primary');
    
    await act(async () => {
      fireEvent.click(startButton);
    });

    expect(message.error).toHaveBeenCalledWith('Please select a camera before scanning.');
    expect(mockHtml5QrCode.start).not.toHaveBeenCalled();
  });

  it('handles camera access errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockGetCameras.mockRejectedValue(new Error('Camera access denied'));

    await act(async () => {
      render(<QRScanner onScanSuccess={mockOnScanSuccess} />);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Unable to get cameras:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  
});