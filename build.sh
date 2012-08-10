cd deps
tar zxf curl-7.27.0.tar.gz
cd curl-7.27.0
./configure && make
cd ../..

node-gyp rebuild