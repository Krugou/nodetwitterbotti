#!/bin/bash

# Change to the project directory
cd /home/aanderson/LuxDei

# Start the SSH agent and add the SSH key
eval `ssh-agent -s`
ssh-add /home/aanderson/.ssh/id_ed25519

# Perform a Git pull to update the code
if git pull | grep -q 'Already up to date.'; then
  echo 'No changes pulled.'
else
  # If changes were pulled, navigate to the frontend directory
  cd frontend
  npm install
  npm run build
  cd ..
  cd backend
  npm i
fi