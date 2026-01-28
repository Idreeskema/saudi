#!/bin/bash

echo "======================================"
echo "Postgraduate Portal Installation"
echo "======================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ NPM version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install additional required packages
echo "📦 Installing jsPDF and html2canvas..."
npm install jspdf html2canvas --save

echo ""
echo "======================================"
echo "✅ Installation Complete!"
echo "======================================"
echo ""
echo "To start the application:"
echo "  npm start"
echo ""
echo "Then open your browser to:"
echo "  http://localhost:4200"
echo ""
echo "Demo Credentials:"
echo "  Student: student@riyadh.edu.sa / password123"
echo "  Registration: registration@riyadh.edu.sa / password123"
echo "  Accounting: accounting@riyadh.edu.sa / password123"
echo "  Authorized: authorized@riyadh.edu.sa / password123"
echo ""
