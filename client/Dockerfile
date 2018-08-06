# Use an official Python runtime as a parent image
FROM node:8
# replace this with your application's default port
EXPOSE 4200

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World


# # install chrome for protractor tests
# RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
# RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -yq google-chrome-stable

# set working directory
RUN mkdir /usr/src/app
# add app
COPY . /usr/src/app
WORKDIR /usr/src/app/

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install -g @angular/cli@6.1.0
# RUN npm install -g @angular/cli@6.1.2



RUN cd /usr/src/app/

# start app
CMD npm link
CMD ng serve --host 0.0.0.0