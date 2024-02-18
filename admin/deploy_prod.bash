#!/bin/bash

git pull
yarn install
yarn build
pm2 delete admin_frontend
pm2 start yarn --name admin_frontend -- start