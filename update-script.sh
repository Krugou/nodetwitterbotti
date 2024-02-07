#!/bin/bash

# Change to the project directory
cd /home/aleksino/nodetwitterbotti


# Perform a Git pull to update the code
if git pull | grep -q 'Already up to date.'; then
  echo 'No changes pulled.'
else
 
  npm i
  cd timekeeper
  npm i
fi