#!/bin/bash

# ErikrafT Language Installation Script
# Status: Early Development

echo "ErikrafT Language"
echo ""
echo "Status:"
echo "Early Development"
echo ""
echo "Runtime binaries:"
echo "Not available yet"
echo ""
echo "Compiler:"
echo "Under development"
echo ""
echo "Repository:"
echo "https://github.com/erikraft/ErikrafT-Language"
echo ""
echo "Follow development progress:"
echo "https://lang.erikraft.com/roadmap"
echo ""

# Validate environment
echo "Checking dependencies..."

if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    echo "OK: $PYTHON_VERSION found."
else
    echo "Error: python3 is required to run the ErikrafT prototype."
    exit 1
fi

echo ""
echo "Installer under development."
echo "To run the current prototype, use: python3 cli/erik.py run <filename>.erik"
