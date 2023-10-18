
# Kill and Delete Current Instances
docker kill reflection-app
docker rm reflection-app

# install dependencies
npm i --legacy-peer-deps

# Build App
npm run build 

# Build Image 
docker build -t reflection-app . 

# Tag Image
docker tag reflection-app philipasd/reflection-app:0.0.0

# Publish Image 
# docker push philipasd/reflection-app:0.0.0